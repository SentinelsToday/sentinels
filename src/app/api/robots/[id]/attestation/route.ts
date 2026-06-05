import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sha256 } from '@/lib/crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tpmHash, secureBootEnabled, firmwareVersion, hardwareSerial } = body;

    if (!tpmHash) {
      return NextResponse.json({ error: "tpmHash required" }, { status: 400 });
    }

    const robot = await db.robot.findUnique({ where: { id } });
    if (!robot) {
      return NextResponse.json({ error: 'Robot not found' }, { status: 404 });
    }

    const verified = tpmHash === (robot as Record<string, unknown>).hardwareFingerprint;
    const status = verified ? 'active' : 'compromised';
    const attestedAt = new Date().toISOString();

    await db.robot.update({ where: { id }, data: { status } });

    const action = verified ? 'hardware_attested' : 'anomaly_detected';
    const details = JSON.stringify({ tpmHash, secureBootEnabled, firmwareVersion, hardwareSerial });
    const previousLog = (await db.auditLog.findFirst({ where: { robotId: id }, orderBy: { timestamp: 'desc' } })) as { hash: string } | null;
    const logHash = sha256((previousLog?.hash || '') + action + details + attestedAt);

    await db.auditLog.create({
      data: {
        robotId: id,
        action,
        details,
        hash: logHash,
        previousHash: previousLog?.hash || null,
        signature: "",
        timestamp: attestedAt,
      },
    });

    return NextResponse.json({ verified, status, attestedAt });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const log = (await db.auditLog.findFirst({
      where: { robotId: id, action: { in: ['hardware_attested', 'anomaly_detected'] } },
      orderBy: { timestamp: 'desc' },
    })) as { action: string; timestamp: string } | null;

    if (!log) {
      return NextResponse.json({ error: 'No attestation found' }, { status: 404 });
    }

    return NextResponse.json({
      verified: log.action === 'hardware_attested',
      status: log.action === 'hardware_attested' ? 'active' : 'compromised',
      attestedAt: log.timestamp,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
