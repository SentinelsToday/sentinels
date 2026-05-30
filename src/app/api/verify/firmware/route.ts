import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sha256, signData, verifySignature } from "@/lib/crypto";

// POST /api/verify/firmware - Submit firmware for verification
export async function POST(req: NextRequest) {
  try {
    const { robotId, version, firmwareData } = await req.json();

    if (!robotId || !version || !firmwareData) {
      return NextResponse.json({ error: "robotId, version, and firmwareData required" }, { status: 400 });
    }

    const robot = await db.robot.findUnique({ where: { id: robotId } });
    if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

    // Hash the firmware
    const hash = sha256(firmwareData);
    const signature = signData(hash, robot.privateKey);

    // Get previous firmware record for chain
    const previousRecord = await db.firmwareRecord.findFirst({
      where: { robotId },
      orderBy: { createdAt: "desc" },
    });

    // Verify signature
    const verified = verifySignature(hash, signature, robot.publicKey);

    const record = await db.firmwareRecord.create({
      data: {
        robotId,
        version,
        hash,
        signature,
        verified,
        previousHash: previousRecord?.hash || null,
      },
    });

    // Audit log
    const logDetails = JSON.stringify({ version, hash, verified, previousHash: previousRecord?.hash || null });
    const lastLog = await db.auditLog.findFirst({ where: { robotId }, orderBy: { timestamp: "desc" } });
    const logHash = sha256((lastLog?.hash || "") + "firmware_updated" + logDetails + new Date().toISOString());
    const logSignature = signData(logHash, robot.privateKey);

    await db.auditLog.create({
      data: { robotId, action: "firmware_updated", details: logDetails, hash: logHash, previousHash: lastLog?.hash || null, signature: logSignature },
    });

    // Update trust score
    const firmwareCount = await db.firmwareRecord.count({ where: { robotId, verified: true } });
    const newTrust = Math.min(100, robot.trustScore + (verified ? 5 : -10));
    await db.robot.update({ where: { id: robotId }, data: { trustScore: newTrust } });

    return NextResponse.json({
      id: record.id,
      version: record.version,
      hash: record.hash,
      verified: record.verified,
      chainValid: !previousRecord || record.previousHash === previousRecord.hash,
      trustScore: newTrust,
    }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
