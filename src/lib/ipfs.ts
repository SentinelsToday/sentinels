import { createHash } from "crypto";

const store = new Map<string, string>();
const pinned = new Set<string>();

export async function uploadToIPFS(data: string | Buffer): Promise<{ cid: string; size: number }> {
  const raw = typeof data === "string" ? data : data.toString("base64");
  const hash = createHash("sha256").update(raw).digest("hex").slice(0, 44);
  const cid = `Qm${hash}`;
  store.set(cid, raw);
  pinned.add(cid);
  return { cid, size: raw.length };
}

export async function getFromIPFS(cid: string): Promise<string | null> {
  return store.get(cid) ?? null;
}

export async function pinCID(cid: string): Promise<boolean> {
  if (!store.has(cid)) return false;
  pinned.add(cid);
  return true;
}

export function getIPFSStats(): { totalPinned: number; totalSize: number } {
  let totalSize = 0;
  for (const v of store.values()) totalSize += v.length;
  return { totalPinned: pinned.size, totalSize };
}
