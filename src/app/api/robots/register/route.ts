import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateEd25519Keypair, generateDID, generateHardwareFingerprint, sha256, signData } from "@/lib/crypto";

// POST /api/robots/register - Register a new robot
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, model, serialNumber, fleetId } = body;

    if (!name || !serialNumber) {
      return NextResponse.json({ error: "name and serialNumber required" }, { status: 400 });
    }

    // Check duplicate
    const existing = await db.robot.findUnique({ where: { serialNumber } });
    if (existing) {
      return NextResponse.json({ error: "Robot with this serialNumber already exists" }, { status: 409 });
    }

    // Generate cryptographic identity
    const keypair = generateEd25519Keypair();
    const did = generateDID(keypair.publicKeyHex);
    const hardwareFingerprint = generateHardwareFingerprint();

    const robot = await db.robot.create({
      data: {
        name,
        model: model || null,
        serialNumber,
        did,
        publicKey: keypair.publicKey,
        privateKey: keypair.privateKey,
        publicKeyHex: keypair.publicKeyHex,
        hardwareFingerprint,
        status: "registered",
        trustScore: 50,
        fleetId: fleetId || null,
      },
    });

    // Create audit log entry
    const logDetails = JSON.stringify({ action: "robot_registered", serialNumber, did });
    const logHash = sha256(logDetails + new Date().toISOString());
    const logSignature = signData(logHash, keypair.privateKey);

    await db.auditLog.create({
      data: {
        robotId: robot.id,
        action: "registered",
        details: logDetails,
        hash: logHash,
        signature: logSignature,
      },
    });

    return NextResponse.json({
      id: robot.id,
      name: robot.name,
      serialNumber: robot.serialNumber,
      did: robot.did,
      publicKey: robot.publicKey,
      publicKeyHex: robot.publicKeyHex,
      hardwareFingerprint: robot.hardwareFingerprint,
      status: robot.status,
      trustScore: robot.trustScore,
      createdAt: robot.createdAt,
    }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/robots/register - List all robots
export async function GET() {
  const robots = await db.robot.findMany({
    select: {
      id: true, name: true, model: true, serialNumber: true,
      did: true, status: true, trustScore: true, fleetId: true, createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ robots, count: robots.length });
}
