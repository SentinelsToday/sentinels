import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateEd25519Keypair, generateDID, sha256, signData } from "@/lib/crypto";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const robot = await db.robot.findUnique({ where: { id } });
    if (!robot) {
      return NextResponse.json({ error: "Robot not found" }, { status: 404 });
    }

    const newKeypair = generateEd25519Keypair();
    const rotatedAt = new Date().toISOString();

    await db.robot.update({
      where: { id },
      data: {
        publicKey: newKeypair.publicKey,
        privateKey: newKeypair.privateKey,
        publicKeyHex: newKeypair.publicKeyHex,
      },
    });

    const logDetails = JSON.stringify({ rotatedAt });
    const logHash = sha256("key_rotated" + logDetails + rotatedAt);
    const logSignature = signData(logHash, newKeypair.privateKey);

    await db.auditLog.create({
      data: {
        robotId: id,
        action: "key_rotated",
        details: logDetails,
        hash: logHash,
        signature: logSignature,
      },
    });

    return NextResponse.json({
      success: true,
      newPublicKey: newKeypair.publicKey,
      rotatedAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Key rotation failed" },
      { status: 500 }
    );
  }
}
