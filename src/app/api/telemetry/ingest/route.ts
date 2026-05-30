import { NextRequest, NextResponse } from 'next/server';
import { insertTelemetry } from '@/lib/clickhouse';
import { db } from '@/lib/db';
import { sha256 } from '@/lib/crypto';

export async function POST(req: NextRequest) {
  const { robotId, eventType, payload } = await req.json();
  if (!robotId || !eventType || !payload) {
    return NextResponse.json({ error: "robotId, eventType, payload required" }, { status: 400 });
  }

  const timestamp = new Date().toISOString();
  const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const hash = sha256(payloadStr);

  await insertTelemetry({ robotId, eventType, payload: payloadStr, timestamp });

  await (db.telemetryEvent as any).create({
    data: { robotId, eventType, payload: payloadStr, hash, signature: "system", verified: false },
  });

  return NextResponse.json({ ingested: true, timestamp });
}
