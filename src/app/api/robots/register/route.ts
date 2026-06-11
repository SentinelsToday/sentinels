import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateEd25519Keypair, generateDID, generateHardwareFingerprint, sha256 } from "@/lib/crypto";
import { rateLimit, getClientIP } from "@/lib/rate-limit";
import { apiError } from "@/lib/utils";

const VALID_NAME = /^[a-zA-Z0-9 _-]{1,100}$/;
const VALID_SERIAL = /^[a-zA-Z0-9_-]{1,50}$/;
const VALID_MODEL = /^[a-zA-Z0-9 _.-]{0,100}$/;

export async function POST(req: NextRequest) {
  const limited = rateLimit(getClientIP(req), "register");
  if (limited) return limited;
  try {
    const body = await req.json();
    const { name, model, serialNumber, fleetId } = body;

    if (!name || !serialNumber) {
      return NextResponse.json({ error: "name and serialNumber required" }, { status: 400 });
    }
    if (typeof name !== "string" || !VALID_NAME.test(name)) {
      return NextResponse.json({ error: "name must be 1-100 chars: letters, numbers, spaces, hyphens, underscores" }, { status: 400 });
    }
    if (typeof serialNumber !== "string" || !VALID_SERIAL.test(serialNumber)) {
      return NextResponse.json({ error: "serialNumber must be 1-50 alphanumeric chars" }, { status: 400 });
    }
    if (model !== undefined && (typeof model !== "string" || !VALID_MODEL.test(model))) {
      return NextResponse.json({ error: "model contains invalid characters" }, { status: 400 });
    }

    const existing = await db.robot.findUnique({ where: { serialNumber } });
    if (existing) {
      return NextResponse.json({ error: "Robot with this serialNumber already exists" }, { status: 409 });
    }

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
        publicKeyHex: keypair.publicKeyHex,
        hardwareFingerprint,
        status: "registered",
        trustScore: 50,
        fleetId: fleetId || null,
      },
    });

    const logDetails = JSON.stringify({ action: "robot_registered", serialNumber, did });
    const logHash = sha256(logDetails + new Date().toISOString());

    await db.auditLog.create({
      data: {
        robotId: robot.id,
        action: "registered",
        details: logDetails,
        hash: logHash,
        signature: "",
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
    return apiError(e);
  }
}

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
