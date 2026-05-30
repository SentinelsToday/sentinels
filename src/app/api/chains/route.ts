import { NextResponse } from "next/server";
import { SUPPORTED_CHAINS } from "@/lib/chains";

export async function GET() {
  return NextResponse.json({ chains: SUPPORTED_CHAINS });
}
