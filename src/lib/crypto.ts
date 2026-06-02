import { generateKeyPairSync, createHash, sign, verify, randomBytes } from "crypto";

export function generateEd25519Keypair() {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  return {
    publicKey: publicKey.export({ type: "spki", format: "pem" }).toString(),
    privateKey: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
    publicKeyHex: publicKey.export({ type: "spki", format: "der" }).toString("hex"),
  };
}

export function sha256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

export function signData(data: string, privateKeyPem: string): string {
  const signature = sign(null, Buffer.from(data), privateKeyPem);
  return signature.toString("hex");
}

export function verifySignature(data: string, signatureHex: string, publicKeyPem: string): boolean {
  try {
    return verify(null, Buffer.from(data), publicKeyPem, Buffer.from(signatureHex, "hex"));
  } catch {
    return false;
  }
}

export function generateDID(publicKeyHex: string): string {
  const hash = sha256(publicKeyHex).slice(0, 40);
  return `did:sentinels:${hash}`;
}

export function generateHardwareFingerprint(): string {
  return randomBytes(32).toString("hex");
}

export function computeTrustScore(factors: {
  firmwareVerified: boolean;
  telemetryAuthentic: boolean;
  uptimeHours: number;
  anomalyCount: number;
  keyAge: number; // days
}): number {
  let score = 50;
  if (factors.firmwareVerified) score += 20;
  if (factors.telemetryAuthentic) score += 15;
  score += Math.min(factors.uptimeHours / 100, 10);
  score -= factors.anomalyCount * 5;
  if (factors.keyAge > 90) score -= 5; // old keys reduce trust
  return Math.max(0, Math.min(100, Math.round(score)));
}
