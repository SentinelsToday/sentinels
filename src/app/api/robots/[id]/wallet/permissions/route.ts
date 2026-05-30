import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const VALID_PERMISSIONS = ["read", "write", "transfer", "stake", "api_access"];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wallet = await db.wallet.findUnique({ where: { robotId: id } });
  if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
  return NextResponse.json({ permissions: JSON.parse(wallet.permissions) });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { permissions } = await req.json();

  if (!Array.isArray(permissions) || !permissions.every((p: string) => VALID_PERMISSIONS.includes(p))) {
    return NextResponse.json({ error: "Invalid permissions" }, { status: 400 });
  }

  const wallet = await db.wallet.update({
    where: { robotId: id },
    data: { permissions: JSON.stringify(permissions) },
  });
  return NextResponse.json({ permissions: JSON.parse(wallet.permissions) });
}
