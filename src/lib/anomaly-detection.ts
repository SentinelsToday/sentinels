import { insforge } from "./insforge";
import { db } from "./db";

export type Anomaly = {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  detectedAt: string;
};

export async function detectAnomalies(robotId: string): Promise<{ anomalies: Anomaly[]; hasAnomaly: boolean }> {
  const now = new Date();
  const anomalies: Anomaly[] = [];

  const robot = await db.robot.findUnique({ where: { id: robotId } });
  if (!robot) return { anomalies: [], hasAnomaly: false };

  // Rule 1: Rapid telemetry (>100 events in 1 minute)
  const oneMinAgo = new Date(now.getTime() - 60_000).toISOString();
  const { count: telemetryCount } = await insforge.database
    .from("TelemetryEvent")
    .select("*", { count: "exact", head: true })
    .eq("robotId", robotId)
    .gte("timestamp", oneMinAgo);

  if ((telemetryCount ?? 0) > 100) {
    anomalies.push({ type: "rapid_telemetry", severity: "high", message: `Rapid telemetry: ${telemetryCount} events in last minute`, detectedAt: now.toISOString() });
  }

  // Rule 2: Trust score below 30
  if (robot.trustScore < 30) {
    anomalies.push({ type: "low_trust_score", severity: "critical", message: `Trust score critically low: ${robot.trustScore}`, detectedAt: now.toISOString() });
  }

  // Rule 3: Multiple failed commands (>3 in 10 min)
  const tenMinAgo = new Date(now.getTime() - 600_000).toISOString();
  const { count: failedCmds } = await insforge.database
    .from("Command")
    .select("*", { count: "exact", head: true })
    .eq("robotId", robotId)
    .eq("status", "failed")
    .gte("createdAt", tenMinAgo);

  if ((failedCmds ?? 0) > 3) {
    anomalies.push({ type: "command_failures", severity: "medium", message: `${failedCmds} failed commands in last 10 minutes`, detectedAt: now.toISOString() });
  }

  // Rule 4: Firmware hash mismatch
  const { data: latestFirmware } = await insforge.database
    .from("FirmwareRecord")
    .select("*")
    .eq("robotId", robotId)
    .order("createdAt", { ascending: false })
    .limit(2);

  if (latestFirmware && latestFirmware.length === 2) {
    if (latestFirmware[0].previousHash && latestFirmware[0].previousHash !== latestFirmware[1].hash) {
      anomalies.push({ type: "firmware_hash_mismatch", severity: "critical", message: "Firmware chain integrity broken: hash mismatch detected", detectedAt: now.toISOString() });
    }
  }

  // Rule 5: Offline for >1 hour after being active
  if (robot.status === "offline") {
    const { data: lastActivity } = await insforge.database
      .from("TelemetryEvent")
      .select("timestamp")
      .eq("robotId", robotId)
      .order("timestamp", { ascending: false })
      .limit(1);

    if (lastActivity && lastActivity.length > 0) {
      const lastSeen = new Date(lastActivity[0].timestamp).getTime();
      if (now.getTime() - lastSeen > 3_600_000) {
        anomalies.push({ type: "prolonged_offline", severity: "medium", message: "Robot offline for over 1 hour after being active", detectedAt: now.toISOString() });
      }
    }
  }

  return { anomalies, hasAnomaly: anomalies.length > 0 };
}
