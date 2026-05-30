import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateEd25519Keypair, generateDID, sha256, signData } from "@/lib/crypto";

// GET /api/robots/[id] - Get robot details
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const robot = await db.robot.findUnique({
    where: { id },
    include: {
      firmwareRecords: { orderBy: { createdAt: "desc" }, take: 5 },
      _count: { select: { telemetryEvents: true, auditLogs: true, commands: true } },
    },
  });

  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  return NextResponse.json({
    id: robot.id,
    name: robot.name,
    model: robot.model,
    serialNumber: robot.serialNumber,
    did: robot.did,
    publicKey: robot.publicKey,
    publicKeyHex: robot.publicKeyHex,
    hardwareFingerprint: robot.hardwareFingerprint,
    status: robot.status,
    trustScore: robot.trustScore,
    fleetId: robot.fleetId,
    createdAt: robot.createdAt,
    updatedAt: robot.updatedAt,
    firmwareRecords: robot.firmwareRecords,
    counts: robot._count,
  });
}

// PATCH /api/robots/[id] - Update robot status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { status, name, model } = body;

  const robot = await db.robot.findUnique({ where: { id } });
  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  const updated = await db.robot.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(name && { name }),
      ...(model && { model }),
    },
  });

  if (status && status !== robot.status) {
    const logDetails = JSON.stringify({ previousStatus: robot.status, newStatus: status });
    const lastLog = await db.auditLog.findFirst({ where: { robotId: id }, orderBy: { timestamp: "desc" } });
    const logHash = sha256((lastLog?.hash || "") + "status_changed" + logDetails + new Date().toISOString());
    const logSignature = signData(logHash, robot.privateKey);

    await db.auditLog.create({
      data: { robotId: id, action: "status_changed", details: logDetails, hash: logHash, previousHash: lastLog?.hash || null, signature: logSignature },
    });
  }

  return NextResponse.json({ id: updated.id, status: updated.status, name: updated.name });
}

// POST /api/robots/[id] - Rotate keys
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const robot = await db.robot.findUnique({ where: { id } });
  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  const newKeypair = generateEd25519Keypair();
  const newDid = generateDID(newKeypair.publicKeyHex);

  await db.robot.update({
    where: { id },
    data: {
      publicKey: newKeypair.publicKey,
      privateKey: newKeypair.privateKey,
      publicKeyHex: newKeypair.publicKeyHex,
      did: newDid,
    },
  });

  // Audit log
  const logDetails = JSON.stringify({ previousDid: robot.did, newDid, rotatedAt: new Date().toISOString() });
  const lastLog = await db.auditLog.findFirst({ where: { robotId: id }, orderBy: { timestamp: "desc" } });
  const logHash = sha256((lastLog?.hash || "") + "key_rotated" + logDetails + new Date().toISOString());
  const logSignature = signData(logHash, newKeypair.privateKey);

  await db.auditLog.create({
    data: { robotId: id, action: "key_rotated", details: logDetails, hash: logHash, previousHash: lastLog?.hash || null, signature: logSignature },
  });

  return NextResponse.json({ id, did: newDid, publicKey: newKeypair.publicKey, publicKeyHex: newKeypair.publicKeyHex });
}
