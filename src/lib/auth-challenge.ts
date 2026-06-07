import { randomBytes } from "crypto";

const TTL_MS = 5 * 60 * 1000;
const challenges = new Map<string, { nonce: string; expiresAt: number }>();

function purgeExpired() {
  const now = Date.now();
  for (const [key, entry] of challenges) {
    if (entry.expiresAt < now) challenges.delete(key);
  }
}

export function issueChallenge(publicKey: string): {
  message: string;
  nonce: string;
  expiresAt: number;
} {
  purgeExpired();
  const nonce = randomBytes(24).toString("hex");
  const expiresAt = Date.now() + TTL_MS;
  challenges.set(publicKey, { nonce, expiresAt });
  const message = `Sign in to Sentinels\n\nWallet: ${publicKey}\nNonce: ${nonce}\nIssued: ${new Date().toISOString()}`;
  return { message, nonce, expiresAt };
}

export function consumeChallenge(publicKey: string, message: string): boolean {
  const entry = challenges.get(publicKey);
  if (!entry) return false;
  if (entry.expiresAt < Date.now()) {
    challenges.delete(publicKey);
    return false;
  }
  if (!message.includes(`Nonce: ${entry.nonce}`)) return false;
  challenges.delete(publicKey);
  return true;
}
