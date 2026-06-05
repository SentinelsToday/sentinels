import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sha256, signData } from "@/lib/crypto";
import { detectAnomalies } from "@/lib/anomaly-detection";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const robot = await db.robot.findUnique({ where: { id } });
  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  const { anomalies, hasAnomaly } = await detectAnomalies(id);
  const checkedAt = new Date().toISOString();

  if (hasAnomaly) {
    const details = JSON.stringify({ anomalies, checkedAt });
    const lastLog = (await db.auditLog.findFirst({ where: { robotId: id }, orderBy: { timestamp: "desc" } })) as { hash: string } | null;
    const logHash = sha256((lastLog?.hash || "") + "anomaly_detected" + details + checkedAt);
    const logSignature = signData(logHash, "ephemeral");

    await db.auditLog.create({
      data: { robotId: id, action: "anomaly_detected", details, hash: logHash, previousHash: lastLog?.hash || null, signature: logSignature },
    });
  }

  return NextResponse.json({ anomalies, hasAnomaly, checkedAt });
}
