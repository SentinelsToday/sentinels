import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyzePattern } from "@/lib/ai-anomaly";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const robot = await db.robot.findUnique({ where: { id } });
  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  const analysis = await analyzePattern(id);

  return NextResponse.json({ ...analysis, analyzedAt: new Date().toISOString() });
}
