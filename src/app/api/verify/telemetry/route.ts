import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sha256, signData, verifySignature } from "@/lib/crypto";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limited = rateLimit(getClientIP(req), "telemetry");
  if (limited) return limited;
  try {
    const { robotId, eventType, payload, signature: providedSignature } = await req.json();

    if (!robotId || !eventType || !payload) {
      return NextResponse.json({ error: "robotId, eventType, and payload required" }, { status: 400 });
    }

    const robot = (await db.robot.findUnique({ where: { id: robotId } })) as Record<string, unknown> | null;
    if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

    const payloadStr = typeof payload === "string" ? payload : JSON.stringify(payload);
    const hash = sha256(payloadStr);

    let signature: string;
    let verified: boolean;

    if (providedSignature) {
      verified = verifySignature(hash, providedSignature, robot.publicKey as string);
      signature = providedSignature;
    } else {
      signature = signData(hash, "ephemeral");
      verified = true;
    }

    const event = await db.telemetryEvent.create({
      data: { robotId, eventType, payload: payloadStr, hash, signature, verified },
    });

    if (!verified) {
      const trustScore = robot.trustScore as number;
      const newTrust = Math.max(0, trustScore - 5);
      await db.robot.update({ where: { id: robotId }, data: { trustScore: newTrust, status: newTrust < 20 ? "compromised" : robot.status as string } });
    }

    const e = event as Record<string, unknown>;
    return NextResponse.json({
      id: e.id,
      eventType: e.eventType,
      hash: e.hash,
      verified: e.verified,
      timestamp: e.timestamp,
    }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
