import { NextResponse } from "next/server";
import { getFromIPFS } from "@/lib/ipfs";

export async function GET(_request: Request, { params }: { params: Promise<{ cid: string }> }) {
  const { cid } = await params;
  const data = await getFromIPFS(cid);
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ cid, data });
}
