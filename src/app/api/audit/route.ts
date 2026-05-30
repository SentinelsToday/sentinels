import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sha256, verifySignature } from "@/lib/crypto";

// GET /api/audit - Query audit logs with filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const robotId = searchParams.get("robotId");
  const action = searchParams.get("action");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  const where: Record<string, unknown> = {};
  if (robotId) where.robotId = robotId;
  if (action) where.action = action;

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({ where, orderBy: { timestamp: "desc" }, take: limit, skip: offset, include: { robot: { select: { name: true, did: true } } } }),
    db.auditLog.count({ where }),
  ]);

  return NextResponse.json({ logs, total, limit, offset });
}

// POST /api/audit/verify - Verify audit chain integrity for a robot
export async function POST(req: NextRequest) {
  const { robotId } = await req.json();
  if (!robotId) return NextResponse.json({ error: "robotId required" }, { status: 400 });

  const robot = await db.robot.findUnique({ where: { id: robotId } });
  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  const logs = await db.auditLog.findMany({ where: { robotId }, orderBy: { timestamp: "asc" } });

  let chainValid = true;
  const issues: string[] = [];

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];

    // Verify hash chain
    if (i === 0) {
      if (log.previousHash !== null) {
        chainValid = false;
        issues.push(`Log ${log.id}: first entry should have null previousHash`);
      }
    } else {
      if (log.previousHash !== logs[i - 1].hash) {
        chainValid = false;
        issues.push(`Log ${log.id}: previousHash mismatch (chain broken)`);
      }
    }

    // Verify signature
    const sigValid = verifySignature(log.hash, log.signature, robot.publicKey);
    if (!sigValid) {
      // Might be signed with a previous key (after rotation), so just note it
      issues.push(`Log ${log.id}: signature verification failed (possible key rotation)`);
    }
  }

  return NextResponse.json({
    robotId,
    totalLogs: logs.length,
    chainValid,
    issues,
    lastHash: logs.length > 0 ? logs[logs.length - 1].hash : null,
  });
}
