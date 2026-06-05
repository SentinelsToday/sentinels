import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computeTrustScore } from "@/lib/crypto";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ robotId: string }> }) {
  const { robotId } = await params;

  const robot = await db.robot.findUnique({ where: { id: robotId } });
  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  const robotRecord = robot as { did: string; createdAt: Date; trustScore: number };

  const firmwareRecords = (await db.firmwareRecord.findMany({ where: { robotId } })) as { verified: boolean }[];
  const telemetryEvents = (await db.telemetryEvent.findMany({ where: { robotId } })) as { verified: boolean; eventType: string }[];
  const unverifiedTelemetry = telemetryEvents.filter(e => !e.verified).length;

  const latestFirmware = firmwareRecords[firmwareRecords.length - 1] || null;
  const keyAgeDays = Math.floor((Date.now() - robotRecord.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const uptimeHours = telemetryEvents.filter(e => e.eventType === "heartbeat").length;

  const score = computeTrustScore({
    firmwareVerified: latestFirmware?.verified ?? false,
    telemetryAuthentic: unverifiedTelemetry === 0,
    uptimeHours,
    anomalyCount: unverifiedTelemetry,
    keyAge: keyAgeDays,
  });

  await db.robot.update({ where: { id: robotId }, data: { trustScore: score } });

  return NextResponse.json({
    robotId,
    did: robotRecord.did,
    trustScore: score,
    factors: {
      firmwareVerified: latestFirmware?.verified ?? false,
      telemetryAuthentic: unverifiedTelemetry === 0,
      totalFirmwareRecords: firmwareRecords.length,
      totalTelemetryEvents: telemetryEvents.length,
      unverifiedEvents: unverifiedTelemetry,
      keyAgeDays,
    },
  });
}
