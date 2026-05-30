import { anchorProof as solanaAnchor, verifyOnChainProof } from "@/lib/solana";

export type Chain = { id: string; name: string; status: "active" | "coming_soon" };

export const SUPPORTED_CHAINS: Chain[] = [
  { id: "solana", name: "Solana", status: "active" },
  { id: "ethereum", name: "Ethereum", status: "coming_soon" },
  { id: "polygon", name: "Polygon", status: "coming_soon" },
  { id: "base", name: "Base", status: "coming_soon" },
];

export async function anchorProof(
  chain: string,
  data: { robotId: string; hash: string; type: string }
): Promise<{ txId: string; chain: string; timestamp: string }> {
  const timestamp = new Date().toISOString();

  if (chain === "solana") {
    const result = await solanaAnchor(data.hash, data.robotId, data.type);
    return { txId: result?.txSignature ?? "failed", chain, timestamp };
  }

  // Mock for coming_soon chains
  return { txId: `mock_${chain}_${Date.now().toString(36)}`, chain, timestamp };
}

export async function verifyProof(
  chain: string,
  txId: string
): Promise<{ verified: boolean; chain: string }> {
  if (chain === "solana") {
    const result = await verifyOnChainProof(txId);
    return { verified: !!result?.verified, chain };
  }

  return { verified: false, chain };
}
