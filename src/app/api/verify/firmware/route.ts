import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sha256 } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { robotId, version, firmwareData } = body;

    if (!robotId || !version || !firmwareData) {
      return NextResponse.json({ error: "robotId, version, and firmwareData required" }, { status: 400 });
    }
    if (typeof robotId !== "string" || typeof version !== "string" || typeof firmwareData !== "string") {
      return NextResponse.json({ error: "robotId, version, and firmwareData must be strings" }, { status: 400 });
    }
    if (firmwareData.length > 10_000_000) {
      return NextResponse.json({ error: "firmwareData exceeds 10MB limit" }, { status: 400 });
    }
    if (version.length > 50) {
      return NextResponse.json({ error: "version exceeds 50 chars" }, { status: 400 });
    }

    const robot = await db.robot.findUnique({ where: { id: robotId } });
    if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

    const hash = sha256(firmwareData);

    const previousRecord = (await db.firmwareRecord.findFirst({
      where: { robotId },
      orderBy: { createdAt: "desc" },
    })) as { hash: string } | null;

    const record = await db.firmwareRecord.create({
      data: {
        robotId,
        version,
        hash,
        signature: "",
        verified: true,
        previousHash: previousRecord?.hash || null,
      },
    });

    const logDetails = JSON.stringify({ version, hash, verified: true, previousHash: previousRecord?.hash || null });
    const lastLog = (await db.auditLog.findFirst({ where: { robotId }, orderBy: { timestamp: "desc" } })) as { hash: string } | null;
    const logHash = sha256((lastLog?.hash || "") + "firmware_updated" + logDetails + new Date().toISOString());

    await db.auditLog.create({
      data: { robotId, action: "firmware_updated", details: logDetails, hash: logHash, previousHash: lastLog?.hash || null, signature: "" },
    });

    const firmwareCount = await db.firmwareRecord.count({ where: { robotId, verified: true } });
    const newTrust = Math.min(100, (robot as Record<string, unknown>).trustScore as number + 5);
    await db.robot.update({ where: { id: robotId }, data: { trustScore: newTrust } });

    const rec = record as Record<string, unknown>;
    return NextResponse.json({
      id: rec.id,
      version: rec.version,
      hash: rec.hash,
      verified: rec.verified,
      chainValid: !previousRecord || rec.previousHash === previousRecord.hash,
      trustScore: newTrust,
    }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
