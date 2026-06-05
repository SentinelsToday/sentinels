import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));
    const robotId = searchParams.get("robotId");
    const action = searchParams.get("action");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Record<string, unknown> = {};
    if (robotId) where.robotId = robotId;
    if (action) where.action = action;
    if (from || to) {
      where.timestamp = {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      };
    }

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        orderBy: { timestamp: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { robotId } = body;
    if (!robotId) return NextResponse.json({ error: "robotId required" }, { status: 400 });

    const robot = await db.robot.findUnique({ where: { id: robotId } });
    if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

    const logs = (await db.auditLog.findMany({ where: { robotId }, orderBy: { timestamp: "asc" } })) as {
      id: string;
      hash: string;
      previousHash: string | null;
      action: string;
    }[];

    let chainValid = true;
    const issues: string[] = [];

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (i === 0) {
        if (log.previousHash !== null) {
          chainValid = false;
          issues.push(`Log ${log.id}: first entry should have null previousHash`);
        }
      } else {
        if (log.previousHash !== logs[i - 1].hash) {
          chainValid = false;
          issues.push(`Log ${log.id}: previousHash mismatch (chain broken)`);
        }
      }
    }

    return NextResponse.json({
      robotId,
      totalLogs: logs.length,
      chainValid,
      issues,
      lastHash: logs.length > 0 ? logs[logs.length - 1].hash : null,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
