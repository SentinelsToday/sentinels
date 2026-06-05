import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bs58 from "bs58";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const robot = (await db.robot.findUnique({ where: { id } })) as Record<string, unknown> | null;
  if (!robot) return NextResponse.json({ error: "Robot not found" }, { status: 404 });

  let wallet = (await db.wallet.findUnique({ where: { robotId: id } })) as Record<string, unknown> | null;
  if (!wallet) {
    const address = bs58.encode(Buffer.from(robot.publicKeyHex as string, "hex"));
    wallet = (await db.wallet.create({
      data: { robotId: id, address, balance: 0, permissions: JSON.stringify(["read"]) },
    })) as Record<string, unknown>;
  }
  return NextResponse.json({ ...wallet, permissions: JSON.parse(wallet.permissions as string) });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { action, amount } = await req.json();

  if (!["deposit", "withdraw"].includes(action) || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "Invalid action or amount" }, { status: 400 });
  }

  let wallet = (await db.wallet.findUnique({ where: { robotId: id } })) as { balance: number; permissions: string } | null;
  if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });

  const newBalance = action === "deposit" ? wallet.balance + amount : wallet.balance - amount;
  if (newBalance < 0) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

  wallet = (await db.wallet.update({ where: { robotId: id }, data: { balance: newBalance } })) as { balance: number; permissions: string };
  return NextResponse.json({ ...wallet, permissions: JSON.parse(wallet.permissions) });
}
