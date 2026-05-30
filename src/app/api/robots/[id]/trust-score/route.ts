import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateTrustScore, calculateTrustFactors, getTrustLevel } from "@/lib/trust-score";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const robot = await db.robot.findUnique({ where: { id } });
  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  const score = await calculateTrustScore(id);
  const level = getTrustLevel(score);
  const factors = await calculateTrustFactors(id);

  await db.robot.update({ where: { id }, data: { trustScore: score } });

  return NextResponse.json({ score, level, factors });
}
