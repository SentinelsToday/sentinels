import { address, type Address } from "@solana/kit";

export type TierKey = "starter" | "fleet" | "enterprise";
export type TokenKey = "USDC" | "SENT";

export interface TierConfig {
  name: string;
  usdMonthly: number | null;
  robotLimit: number;
  perks: string[];
}

export const TIERS: Record<TierKey, TierConfig> = {
  starter: {
    name: "Starter",
    usdMonthly: 29,
    robotLimit: 10,
    perks: [
      "Up to 10 robots",
      "Basic identity & DID registration",
      "Signed telemetry (1K events/day)",
      "Community support",
      "Dashboard access",
    ],
  },
  fleet: {
    name: "Fleet",
    usdMonthly: 99,
    robotLimit: 100,
    perks: [
      "Unlimited robots",
      "Full identity engine + key rotation",
      "Signed telemetry (unlimited)",
      "Firmware verification pipeline",
      "Fleet command dashboard",
      "On-chain proof anchoring",
      "Priority support",
    ],
  },
  enterprise: {
    name: "Enterprise",
    usdMonthly: null,
    robotLimit: -1,
    perks: [
      "Everything in Fleet",
      "SOC 2 / ISO 27001 compliance",
      "Dedicated infrastructure",
      "Custom SLA (99.99%+)",
      "Hardware attestation (TPM/SGX)",
      "Dedicated support engineer",
      "On-prem deployment option",
      "Audit log exports",
    ],
  },
};

export const SENT_DISCOUNT_BPS = 2000;

export const NETWORK: "devnet" | "mainnet-beta" =
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta") || "devnet";

export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  (NETWORK === "mainnet-beta"
    ? "https://api.mainnet-beta.solana.com"
    : "https://api.devnet.solana.com");

export const SUBSCRIPTIONS_PROGRAM_ID: Address = address(
  "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44",
);

const USDC_MINTS: Record<typeof NETWORK, string> = {
  devnet: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  "mainnet-beta": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
};

export const USDC_MINT: Address = address(
  process.env.NEXT_PUBLIC_USDC_MINT || USDC_MINTS[NETWORK],
);

const SENT_MINT_RAW = process.env.NEXT_PUBLIC_SENT_MINT;
export const SENT_MINT: Address | null = SENT_MINT_RAW ? address(SENT_MINT_RAW) : null;

const MERCHANT_RAW = process.env.NEXT_PUBLIC_MERCHANT_ADDRESS;
export const MERCHANT_ADDRESS: Address | null = MERCHANT_RAW ? address(MERCHANT_RAW) : null;

export const PLAN_IDS: Record<TierKey, Record<TokenKey, bigint | null>> = {
  starter: { USDC: 1n, SENT: 2n },
  fleet: { USDC: 3n, SENT: 4n },
  enterprise: { USDC: null, SENT: null },
};

const TOKEN_DECIMALS: Record<TokenKey, number> = { USDC: 6, SENT: 6 };

export function priceForTier(tier: TierKey, token: TokenKey): bigint | null {
  const usd = TIERS[tier].usdMonthly;
  if (usd == null) return null;
  const decimals = TOKEN_DECIMALS[token];
  const base = BigInt(Math.round(usd * 10 ** decimals));
  if (token === "SENT") {
    return (base * BigInt(10_000 - SENT_DISCOUNT_BPS)) / 10_000n;
  }
  return base;
}

export function formatTokenAmount(amount: bigint, token: TokenKey): string {
  const decimals = TOKEN_DECIMALS[token];
  const whole = amount / 10n ** BigInt(decimals);
  const frac = amount % 10n ** BigInt(decimals);
  return frac === 0n ? `${whole}` : `${whole}.${frac.toString().padStart(decimals, "0").replace(/0+$/, "")}`;
}

export function mintFor(token: TokenKey): Address | null {
  return token === "USDC" ? USDC_MINT : SENT_MINT;
}

export interface DisplayPrice {
  amountBase: bigint | null;
  display: string;
  token: TokenKey;
  tier: TierKey;
}

export function displayPrices(tier: TierKey): DisplayPrice[] {
  return (["USDC", "SENT"] as TokenKey[]).map((token) => {
    const amountBase = priceForTier(tier, token);
    return {
      amountBase,
      token,
      tier,
      display:
        amountBase == null
          ? "Custom"
          : `${formatTokenAmount(amountBase, token)} ${token}`,
    };
  });
}

export const BILLING_PERIOD_HOURS = 720n;
