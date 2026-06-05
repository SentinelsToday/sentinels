import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sha256 } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  try {
    const robotId = req.nextUrl.searchParams.get("robotId");
    if (!robotId) return NextResponse.json({ error: "robotId required" }, { status: 400 });

    const [sent, received] = await Promise.all([
      db.transaction.findMany({ where: { fromRobotId: robotId }, orderBy: { createdAt: "desc" } }),
      db.transaction.findMany({ where: { toRobotId: robotId }, orderBy: { createdAt: "desc" } }),
    ]);

    const allSent = sent as { createdAt: string }[];
    const allReceived = received as { createdAt: string }[];
    const transactions = [...allSent, ...allReceived].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ transactions });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromRobotId, toRobotId, amount, type, memo } = body;

    if (!fromRobotId || !toRobotId || !amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid parameters: fromRobotId, toRobotId, and positive amount required" }, { status: 400 });
    }
    if (amount > 1_000_000_000) {
      return NextResponse.json({ error: "Amount exceeds maximum (1B)" }, { status: 400 });
    }

    const [sender, receiver] = await Promise.all([
      db.robot.findUnique({ where: { id: fromRobotId } }),
      db.robot.findUnique({ where: { id: toRobotId } }),
    ]);

    if (!sender || !receiver) {
      return NextResponse.json({ error: "Robot not found" }, { status: 404 });
    }

    const senderWallet = (await db.wallet.findFirst({ where: { robotId: fromRobotId } })) as { id: string; balance: number } | null;
    if (!senderWallet || senderWallet.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    const receiverWallet = (await db.wallet.findFirst({ where: { robotId: toRobotId } })) as { id: string; balance: number } | null;
    if (!receiverWallet) {
      return NextResponse.json({ error: "Receiver wallet not found" }, { status: 400 });
    }

    await Promise.all([
      db.wallet.update({ where: { id: senderWallet.id }, data: { balance: senderWallet.balance - amount } }),
      db.wallet.update({ where: { id: receiverWallet.id }, data: { balance: receiverWallet.balance + amount } }),
    ]);

    const now = new Date().toISOString();
    const transaction = await db.transaction.create({
      data: {
        fromRobotId,
        toRobotId,
        amount,
        type: type || "transfer",
        status: "completed",
        memo: memo || null,
        completedAt: now,
      },
    });

    const txHash = sha256(JSON.stringify({ fromRobotId, toRobotId, amount, timestamp: now }));
    const details = JSON.stringify({ transactionId: (transaction as Record<string, unknown>).id, amount, type: type || "transfer" });

    await Promise.all([
      db.auditLog.create({
        data: { robotId: fromRobotId, action: "payment_sent", details, hash: txHash, signature: "", timestamp: now },
      }),
      db.auditLog.create({
        data: { robotId: toRobotId, action: "payment_received", details, hash: txHash, signature: "", timestamp: now },
      }),
    ]);

    return NextResponse.json({ transaction });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
