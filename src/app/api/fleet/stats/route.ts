import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/fleet/stats - Fleet-wide statistics
export async function GET() {
  const [totalRobots, activeRobots, compromisedRobots, totalFleets, totalTelemetry, totalFirmware, avgTrust] = await Promise.all([
    db.robot.count(),
    db.robot.count({ where: { status: "active" } }),
    db.robot.count({ where: { status: "compromised" } }),
    db.fleet.count(),
    db.telemetryEvent.count(),
    db.firmwareRecord.count(),
    db.robot.aggregate({ _avg: { trustScore: true } }),
  ]);

  return NextResponse.json({
    totalRobots,
    activeRobots,
    offlineRobots: totalRobots - activeRobots - compromisedRobots,
    compromisedRobots,
    totalFleets,
    totalTelemetryEvents: totalTelemetry,
    totalFirmwareRecords: totalFirmware,
    averageTrustScore: Math.round(avgTrust._avg.trustScore || 0),
  });
}
