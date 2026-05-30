import { NextRequest, NextResponse } from "next/server";
import { verifyProof } from "@/lib/chains";

export async function POST(req: NextRequest) {
  const { chain, txId } = await req.json();
  const result = await verifyProof(chain, txId);
  return NextResponse.json({ ...result, txId });
}
