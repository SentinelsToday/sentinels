import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sha256, signData } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  const robotId = req.nextUrl.searchParams.get("robotId");
  if (!robotId) return NextResponse.json({ error: "robotId required" }, { status: 400 });

  const [sent, received] = await Promise.all([
    db.transaction.findMany({ where: { fromRobotId: robotId }, orderBy: { createdAt: "desc" } }),
    db.transaction.findMany({ where: { toRobotId: robotId }, orderBy: { createdAt: "desc" } }),
  ]);

  const transactions = [...sent, ...received].sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({ transactions });
}

export async function POST(req: NextRequest) {
  const { fromRobotId, toRobotId, amount, type, memo } = await req.json();

  if (!fromRobotId || !toRobotId || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const [sender, receiver] = await Promise.all([
    db.robot.findUnique({ where: { id: fromRobotId } }),
    db.robot.findUnique({ where: { id: toRobotId } }),
  ]);

  if (!sender || !receiver) {
    return NextResponse.json({ error: "Robot not found" }, { status: 404 });
  }

  const senderWallet = await db.wallet.findFirst({ where: { robotId: fromRobotId } });
  if (!senderWallet || senderWallet.balance < amount) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
  }

  const receiverWallet = await db.wallet.findFirst({ where: { robotId: toRobotId } });
  if (!receiverWallet) {
    return NextResponse.json({ error: "Receiver wallet not found" }, { status: 400 });
  }

  // Update balances
  await Promise.all([
    db.wallet.update({ where: { id: senderWallet.id }, data: { balance: senderWallet.balance - amount } }),
    db.wallet.update({ where: { id: receiverWallet.id }, data: { balance: receiverWallet.balance + amount } }),
  ]);

  // Create transaction
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

  // Audit logs
  const txHash = sha256(JSON.stringify({ fromRobotId, toRobotId, amount, timestamp: now }));
  const details = JSON.stringify({ transactionId: transaction.id, amount, type: type || "transfer" });

  await Promise.all([
    db.auditLog.create({
      data: {
        robotId: fromRobotId,
        action: "payment_sent",
        details,
        hash: txHash,
        signature: signData(txHash, sender.privateKey),
        timestamp: now,
      },
    }),
    db.auditLog.create({
      data: {
        robotId: toRobotId,
        action: "payment_received",
        details,
        hash: txHash,
        signature: signData(txHash, receiver.privateKey),
        timestamp: now,
      },
    }),
  ]);

  return NextResponse.json({ transaction });
}
