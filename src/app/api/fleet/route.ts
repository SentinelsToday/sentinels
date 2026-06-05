import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const VALID_NAME = /^[a-zA-Z0-9 _-]{1,100}$/;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10) || 10));
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (search) where.name = { contains: search, mode: "insensitive" } as Record<string, unknown>;
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
      robots: (robots as Record<string, unknown>[]).map((f) => ({
        ...f,
        robotCount: ((f as { _count: { robots: number } })._count as { robots: number }).robots,
      })),
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
    const { name, description } = body;

    if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
    if (!VALID_NAME.test(name)) {
      return NextResponse.json({ error: "name must be 1-100 chars: letters, numbers, spaces, hyphens, underscores" }, { status: 400 });
    }

    const fleet = await db.fleet.create({ data: { name, description: description || null } });
    return NextResponse.json(fleet, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
