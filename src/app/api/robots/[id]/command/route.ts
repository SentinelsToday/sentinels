import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sha256, signData } from "@/lib/crypto";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

// POST /api/robots/[id]/command - Send command to robot
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = rateLimit(getClientIP(req), "command");
  if (limited) return limited;
  const { id } = await params;
  const { type, payload } = await req.json();

  if (!type) return NextResponse.json({ error: "command type required" }, { status: 400 });

  const robot = await db.robot.findUnique({ where: { id } });
  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  const command = await db.command.create({
    data: { robotId: id, type, payload: payload ? JSON.stringify(payload) : null, status: "pending" },
  });

  // Audit log
  const logDetails = JSON.stringify({ commandId: command.id, type, payload });
  const lastLog = await db.auditLog.findFirst({ where: { robotId: id }, orderBy: { timestamp: "desc" } });
  const logHash = sha256((lastLog?.hash || "") + "command_executed" + logDetails + new Date().toISOString());
  const logSignature = signData(logHash, robot.privateKey);

  await db.auditLog.create({
    data: { robotId: id, action: "command_executed", details: logDetails, hash: logHash, previousHash: lastLog?.hash || null, signature: logSignature },
  });

  return NextResponse.json(command, { status: 201 });
}

// GET /api/robots/[id]/command - Get command history
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const commands = await db.command.findMany({ where: { robotId: id }, orderBy: { issuedAt: "desc" }, take: 50 });
  return NextResponse.json({ commands });
}
