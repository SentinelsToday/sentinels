import { db } from "@/lib/db";

export type TrustLevel = "critical" | "low" | "medium" | "high" | "verified";

export interface TrustFactor {
  name: string;
  impact: number;
}

export function getTrustLevel(score: number): TrustLevel {
  if (score <= 20) return "critical";
  if (score <= 40) return "low";
  if (score <= 60) return "medium";
  if (score <= 80) return "high";
  return "verified";
}

export async function calculateTrustScore(robotId: string): Promise<number> {
  const robot = await db.robot.findUnique({ where: { id: robotId } });
  if (!robot) throw new Error("Robot not found");

  let score = 50;

  if (robot.status === "compromised") score -= 50;

  const firmwareRecords = (await db.firmwareRecord.findMany({ where: { robotId } })) as Record<string, unknown>[];
  const verifiedFirmware = firmwareRecords.filter((f) => f.verified).length;
  score += verifiedFirmware * 10;

  const telemetryEvents = (await db.telemetryEvent.findMany({ where: { robotId } })) as Record<string, unknown>[];
  const verifiedTelemetry = telemetryEvents.filter((e) => e.verified).length;
  score += Math.min(verifiedTelemetry * 5, 20);

  const auditLogs = (await db.auditLog.findMany({ where: { robotId } })) as Record<string, unknown>[];
  const hasAnomaly = auditLogs.some((l) => l.action === "anomaly_detected");
  if (hasAnomaly) score -= 20;

  const keyRotated = auditLogs.some((l) => {
    if (l.action !== "key_rotated") return false;
    const age = Date.now() - new Date(l.timestamp as string).getTime();
    return age < 7 * 24 * 60 * 60 * 1000;
  });
  if (keyRotated) score += 5;

  const heartbeats = telemetryEvents.filter((e) => e.eventType === "heartbeat").length;
  if (heartbeats > 168) score += 10;
  else if (heartbeats > 24) score += 5;

  return Math.max(0, Math.min(100, score));
}

export async function calculateTrustFactors(robotId: string): Promise<TrustFactor[]> {
  const robot = await db.robot.findUnique({ where: { id: robotId } });
  if (!robot) throw new Error("Robot not found");

  const factors: TrustFactor[] = [{ name: "base_score", impact: 50 }];

  if (robot.status === "compromised") factors.push({ name: "status_compromised", impact: -50 });

  const firmwareRecords = (await db.firmwareRecord.findMany({ where: { robotId } })) as Record<string, unknown>[];
  const verifiedFirmware = firmwareRecords.filter((f) => f.verified).length;
  if (verifiedFirmware > 0) factors.push({ name: "firmware_verified", impact: verifiedFirmware * 10 });

  const telemetryEvents = (await db.telemetryEvent.findMany({ where: { robotId } })) as Record<string, unknown>[];
  const verifiedTelemetry = telemetryEvents.filter((e) => e.verified).length;
  if (verifiedTelemetry > 0) factors.push({ name: "telemetry_verified", impact: Math.min(verifiedTelemetry * 5, 20) });

  const auditLogs = (await db.auditLog.findMany({ where: { robotId } })) as Record<string, unknown>[];
  if (auditLogs.some((l) => l.action === "anomaly_detected")) factors.push({ name: "anomaly_detected", impact: -20 });

  const keyRotated = auditLogs.some((l) => {
    if (l.action !== "key_rotated") return false;
    return Date.now() - new Date(l.timestamp as string).getTime() < 7 * 24 * 60 * 60 * 1000;
  });
  if (keyRotated) factors.push({ name: "key_rotated_recently", impact: 5 });

  const heartbeats = telemetryEvents.filter((e) => e.eventType === "heartbeat").length;
  if (heartbeats > 168) factors.push({ name: "uptime_7d", impact: 10 });
  else if (heartbeats > 24) factors.push({ name: "uptime_24h", impact: 5 });

  return factors;
}
