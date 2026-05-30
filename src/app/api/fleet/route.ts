import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/fleet - List all fleets with robot counts
export async function GET() {
  const fleets = await db.fleet.findMany({
    include: { _count: { select: { robots: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ fleets: fleets.map(f => ({ ...f, robotCount: f._count.robots })) });
}

// POST /api/fleet - Create a new fleet
export async function POST(req: NextRequest) {
  try {
    const { name, description } = await req.json();
    if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

    const fleet = await db.fleet.create({ data: { name, description: description || null } });
    return NextResponse.json(fleet, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
