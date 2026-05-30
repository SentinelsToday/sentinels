import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sha256, signData } from "@/lib/crypto";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await db.softwareUpdate.findMany({ where: { robotId: id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ updates });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { version, packageUrl, packageHash, scheduledAt } = await req.json();

  if (!version || !packageUrl || !packageHash) {
    return NextResponse.json({ error: "version, packageUrl, packageHash required" }, { status: 400 });
  }

  const robot = await db.robot.findUnique({ where: { id } });
  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  const update = await db.softwareUpdate.create({
    data: { robotId: id, version, packageUrl, packageHash, scheduledAt: scheduledAt || null },
  });

  // Audit log
  const logDetails = JSON.stringify({ updateId: update.id, version, packageUrl });
  const logs = await db.auditLog.findMany({ where: { robotId: id }, orderBy: { timestamp: "desc" }, take: 1 });
  const lastLog = logs[0] || null;
  const logHash = sha256((lastLog?.hash || "") + "software_update_scheduled" + logDetails + new Date().toISOString());
  const logSignature = signData(logHash, robot.privateKey);

  await db.auditLog.create({
    data: { robotId: id, action: "software_update_scheduled", details: logDetails, hash: logHash, previousHash: lastLog?.hash || null, signature: logSignature },
  });

  return NextResponse.json(update, { status: 201 });
}
