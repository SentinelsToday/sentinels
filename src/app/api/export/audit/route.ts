import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const robotId = searchParams.get("robotId");
  const format = searchParams.get("format") || "json";
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = {};
  if (robotId) where.robotId = robotId;
  if (from || to) {
    where.timestamp = {
      ...(from && { gte: new Date(from) }),
      ...(to && { lte: new Date(to) }),
    };
  }

  const logs = await db.auditLog.findMany({ where, orderBy: { timestamp: "desc" } });

  if (format === "csv") {
    const header = "id,robotId,action,details,hash,previousHash,timestamp";
    const rows = logs.map((l: any) =>
      [l.id, l.robotId, l.action, `"${(l.details || "").replace(/"/g, '""')}"`, l.hash, l.previousHash || "", l.timestamp].join(",")
    );
    const csv = [header, ...rows].join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=audit-logs.csv",
      },
    });
  }

  return NextResponse.json(logs);
}
