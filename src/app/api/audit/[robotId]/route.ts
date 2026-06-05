import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ robotId: string }> }) {
  const { robotId } = await params;

  const robot = await db.robot.findUnique({ where: { id: robotId } });
  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  const logs = (await db.auditLog.findMany({ where: { robotId }, orderBy: { timestamp: "asc" } })) as {
    id: string;
    action: string;
    details: string;
    hash: string;
    previousHash: string | null;
    signature: string;
    timestamp: string;
  }[];

  return NextResponse.json({
    robot: { id: robot.id, name: robot.name, did: robot.did, serialNumber: robot.serialNumber },
    auditTrail: logs.map((l) => ({
      id: l.id,
      action: l.action,
      details: JSON.parse(l.details),
      hash: l.hash,
      previousHash: l.previousHash,
      signature: l.signature,
      timestamp: l.timestamp,
    })),
    totalEntries: logs.length,
    exportedAt: new Date().toISOString(),
  });
}
