import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateEd25519Keypair, generateDID, sha256 } from "@/lib/crypto";

const VALID_STATUSES = ["active", "offline", "maintenance", "compromised", "registered"] as const;
const VALID_NAME = /^[a-zA-Z0-9 _-]{1,100}$/;
const VALID_MODEL = /^[a-zA-Z0-9 _.-]{0,100}$/;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const robot = await db.robot.findUnique({
      where: { id },
      include: {
        firmwareRecords: { orderBy: { createdAt: "desc" }, take: 5 },
        _count: { select: { telemetryEvents: true, auditLogs: true, commands: true } },
      },
    });

    if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

    const r = robot as Record<string, unknown>;
    return NextResponse.json({
      id: r.id,
      name: r.name,
      model: r.model,
      serialNumber: r.serialNumber,
      did: r.did,
      publicKey: r.publicKey,
      publicKeyHex: r.publicKeyHex,
      hardwareFingerprint: r.hardwareFingerprint,
      status: r.status,
      trustScore: r.trustScore,
      fleetId: r.fleetId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      firmwareRecords: r.firmwareRecords,
      counts: (r._count as Record<string, unknown>),
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, name, model } = body;

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }
    if (name && (typeof name !== "string" || !VALID_NAME.test(name))) {
      return NextResponse.json({ error: "name must be 1-100 chars: letters, numbers, spaces, hyphens, underscores" }, { status: 400 });
    }
    if (model && (typeof model !== "string" || !VALID_MODEL.test(model))) {
      return NextResponse.json({ error: "model contains invalid characters" }, { status: 400 });
    }

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

    const robotRecord = robot as { status: string; did: string };
    if (status && status !== robotRecord.status) {
      const logDetails = JSON.stringify({ previousStatus: robotRecord.status, newStatus: status });
      const lastLog = (await db.auditLog.findFirst({ where: { robotId: id }, orderBy: { timestamp: "desc" } })) as { hash: string } | null;
      const logHash = sha256((lastLog?.hash || "") + "status_changed" + logDetails + new Date().toISOString());

      await db.auditLog.create({
        data: { robotId: id, action: "status_changed", details: logDetails, hash: logHash, previousHash: lastLog?.hash || null, signature: "" },
      });
    }

    const u = updated as Record<string, unknown>;
    return NextResponse.json({ id: u.id, status: u.status, name: u.name });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const robot = await db.robot.findUnique({ where: { id } });
    if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

    const robotRecord = robot as { did: string };
    const newKeypair = generateEd25519Keypair();
    const newDid = generateDID(newKeypair.publicKeyHex);

    await db.robot.update({
      where: { id },
      data: {
        publicKey: newKeypair.publicKey,
        publicKeyHex: newKeypair.publicKeyHex,
        did: newDid,
      },
    });

    const logDetails = JSON.stringify({ previousDid: robotRecord.did, newDid, rotatedAt: new Date().toISOString() });
    const lastLog = (await db.auditLog.findFirst({ where: { robotId: id }, orderBy: { timestamp: "desc" } })) as { hash: string } | null;
    const logHash = sha256((lastLog?.hash || "") + "key_rotated" + logDetails + new Date().toISOString());

    await db.auditLog.create({
      data: { robotId: id, action: "key_rotated", details: logDetails, hash: logHash, previousHash: lastLog?.hash || null, signature: "" },
    });

    return NextResponse.json({ id, did: newDid, publicKey: newKeypair.publicKey, publicKeyHex: newKeypair.publicKeyHex });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
