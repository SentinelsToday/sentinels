import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sha256 } from "@/lib/crypto";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

const VALID_COMMAND_TYPES = ["start", "stop", "pause", "resume", "shutdown", "reboot", "update", "calibrate", "scan", "report"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = rateLimit(getClientIP(req), "command");
  if (limited) return limited;

  try {
    const { id } = await params;
    const body = await req.json();
    const { type, payload } = body;

    if (!type) return NextResponse.json({ error: "command type required" }, { status: 400 });
    if (!VALID_COMMAND_TYPES.includes(type)) {
      return NextResponse.json({ error: `Invalid command type. Must be one of: ${VALID_COMMAND_TYPES.join(", ")}` }, { status: 400 });
    }

    const robot = await db.robot.findUnique({ where: { id } });
    if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

    const command = await db.command.create({
      data: { robotId: id, type, payload: payload ? JSON.stringify(payload) : null, status: "pending" },
    });

    const logDetails = JSON.stringify({ commandId: (command as Record<string, unknown>).id, type, payload });
    const lastLog = (await db.auditLog.findFirst({ where: { robotId: id }, orderBy: { timestamp: "desc" } })) as { hash: string } | null;
    const logHash = sha256((lastLog?.hash || "") + "command_executed" + logDetails + new Date().toISOString());

    await db.auditLog.create({
      data: { robotId: id, action: "command_executed", details: logDetails, hash: logHash, previousHash: lastLog?.hash || null, signature: "" },
    });

    return NextResponse.json(command, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const commands = await db.command.findMany({ where: { robotId: id }, orderBy: { issuedAt: "desc" }, take: 50 });
    return NextResponse.json({ commands });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
