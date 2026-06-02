import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const robotId = searchParams.get("robotId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!robotId) return NextResponse.json({ error: "robotId required" }, { status: 400 });

  const robot = await db.robot.findUnique({ where: { id: robotId } });
  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  const where: Record<string, unknown> = { robotId };
  if (from || to) {
    where.timestamp = {
      ...(from && { gte: new Date(from) }),
      ...(to && { lte: new Date(to) }),
    };
  }

  const logs = await db.auditLog.findMany({ where, orderBy: { timestamp: "asc" } });

  const trustScoreHistory = logs
    .filter((l: any) => l.action === "trust_score_updated")
    .map((l: any) => ({ timestamp: l.timestamp, details: l.details }));

  const countByAction = (action: string) => logs.filter((l: any) => l.action === action).length;

  // Telemetry verification is tracked via the TelemetryEvent.verified boolean
  const telemetryEvents = await db.telemetryEvent.findMany({ where: { robotId } });
  const telemetryVerificationCount = telemetryEvents.filter((e: any) => e.verified).length;

  return NextResponse.json({
    report: {
      robot: { name: robot.name, did: robot.did, status: robot.status },
      trustScoreHistory,
      firmwareVerificationCount: countByAction("firmware_updated"),
      telemetryVerificationCount,
      anomalyCount: countByAction("anomaly_detected"),
      keyRotationCount: countByAction("key_rotated"),
      totalAuditEntries: logs.length,
    },
    generatedAt: new Date().toISOString(),
    period: { from: from || null, to: to || null },
  });
}
