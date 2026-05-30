import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/fleet - List fleets with robot counts, search, status filter, and pagination
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));
  const search = searchParams.get("search");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (search) where.name = { contains: search, mode: "insensitive" };
  if (status) where.status = status;

  const [robots, total] = await Promise.all([
    db.fleet.findMany({
      where,
      include: { _count: { select: { robots: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.fleet.count({ where }),
  ]);

  return NextResponse.json({
    robots: robots.map(f => ({ ...f, robotCount: f._count.robots })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
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
