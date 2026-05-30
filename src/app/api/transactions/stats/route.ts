import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const robotId = req.nextUrl.searchParams.get("robotId");
  if (!robotId) return NextResponse.json({ error: "robotId required" }, { status: 400 });

  const [sent, received] = await Promise.all([
    db.transaction.findMany({ where: { fromRobotId: robotId } }),
    db.transaction.findMany({ where: { toRobotId: robotId } }),
  ]);

  const totalSent = sent.reduce((sum: number, t: any) => sum + t.amount, 0);
  const totalReceived = received.reduce((sum: number, t: any) => sum + t.amount, 0);
  const all = [...sent, ...received].sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({
    totalSent,
    totalReceived,
    transactionCount: all.length,
    lastTransaction: all[0] || null,
  });
}
