import { NextRequest, NextResponse } from 'next/server';
import { insertTelemetry } from '@/lib/clickhouse';
import { db } from '@/lib/db';
import { sha256 } from '@/lib/crypto';
import { apiError } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { robotId, eventType, payload } = body;

    if (!robotId || !eventType || !payload) {
      return NextResponse.json({ error: "robotId, eventType, payload required" }, { status: 400 });
    }
    if (typeof robotId !== "string" || typeof eventType !== "string") {
      return NextResponse.json({ error: "robotId and eventType must be strings" }, { status: 400 });
    }
    const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
    if (payloadStr.length > 100_000) {
      return NextResponse.json({ error: "payload exceeds 100KB limit" }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const hash = sha256(payloadStr);

    await insertTelemetry({ robotId, eventType, payload: payloadStr, timestamp });

    await db.telemetryEvent.create({
      data: { robotId, eventType, payload: payloadStr, hash, signature: "", verified: false },
    });

    return NextResponse.json({ ingested: true, timestamp });
  } catch (e: unknown) {
    return apiError(e);
  }
}
