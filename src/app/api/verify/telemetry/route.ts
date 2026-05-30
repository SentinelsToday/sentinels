import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sha256, signData, verifySignature } from "@/lib/crypto";

// POST /api/verify/telemetry - Submit signed telemetry
export async function POST(req: NextRequest) {
  try {
    const { robotId, eventType, payload, signature: providedSignature } = await req.json();

    if (!robotId || !eventType || !payload) {
      return NextResponse.json({ error: "robotId, eventType, and payload required" }, { status: 400 });
    }

    const robot = await db.robot.findUnique({ where: { id: robotId } });
    if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

    const payloadStr = typeof payload === "string" ? payload : JSON.stringify(payload);
    const hash = sha256(payloadStr);

    // If signature provided, verify it; otherwise sign server-side
    let signature: string;
    let verified: boolean;

    if (providedSignature) {
      verified = verifySignature(hash, providedSignature, robot.publicKey);
      signature = providedSignature;
    } else {
      signature = signData(hash, robot.privateKey);
      verified = true;
    }

    const event = await db.telemetryEvent.create({
      data: { robotId, eventType, payload: payloadStr, hash, signature, verified },
    });

    // Update trust: unverified telemetry reduces trust
    if (!verified) {
      const newTrust = Math.max(0, robot.trustScore - 5);
      await db.robot.update({ where: { id: robotId }, data: { trustScore: newTrust, status: newTrust < 20 ? "compromised" : robot.status } });
    }

    return NextResponse.json({
      id: event.id,
      eventType: event.eventType,
      hash: event.hash,
      verified: event.verified,
      timestamp: event.timestamp,
    }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
