import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ keyId: string }> }) {
  const { keyId } = await params;
  const fleet = (await db.fleet.findUnique({ where: { id: keyId } })) as Record<string, unknown> | null;
  if (!fleet || !fleet.apiKey) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: fleet.id,
    name: fleet.name,
    maskedKey: "•".repeat(24) + (fleet.apiKey as string).slice(-8),
    createdAt: fleet.createdAt,
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ keyId: string }> }) {
  const { keyId } = await params;
  const newKey = `sk_${crypto.randomUUID().replace(/-/g, "")}`;
  await db.fleet.update({ where: { id: keyId }, data: { apiKey: newKey } });
  return NextResponse.json({ message: "Key revoked and regenerated", apiKey: newKey });
}
