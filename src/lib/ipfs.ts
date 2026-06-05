import { createHash } from "crypto";

const IPFS_ENABLED = !!process.env.IPFS_GATEWAY_URL;

const store = new Map<string, string>();
const pinned = new Set<string>();

export async function uploadToIPFS(data: string | Buffer): Promise<{ cid: string; size: number }> {
  if (IPFS_ENABLED) {
    throw new Error("Real IPFS not yet implemented - set IPFS_GATEWAY_URL");
  }
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
