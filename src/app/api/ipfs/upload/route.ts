import { NextResponse } from "next/server";
import { uploadToIPFS } from "@/lib/ipfs";

export async function POST(request: Request) {
  const { data, type } = await request.json();
  if (!data || !["firmware", "log", "telemetry"].includes(type)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const result = await uploadToIPFS(data);
  return NextResponse.json({ ...result, type, uploadedAt: new Date().toISOString() });
}
