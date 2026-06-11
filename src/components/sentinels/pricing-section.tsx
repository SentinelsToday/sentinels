"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

interface TokenOffer {
  token: "USDC" | "SENT";
  planId: string | null;
  amountBase: string | null;
  amountDisplay: string;
  discountBps: number;
}

interface TierResponse {
  tier: "starter" | "fleet" | "enterprise";
  name: string;
  usdMonthly: number | null;
  perks: string[];
  tokens: TokenOffer[];
}

interface PlansResponse {
  network: string;
  merchant: string | null;
  tiers: TierResponse[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

interface SolanaProvider {
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
}

function highlighted(tier: TierResponse["tier"]) {
  return tier === "fleet";
}

async function handleSubscribe(tier: TierResponse, offer: TokenOffer, setError: (m: string) => void) {
  if (tier.tier === "enterprise") {
    window.location.href = "#cta";
    return;
  }
  if (!offer.planId || !offer.amountBase) {
    setError("Plan not yet provisioned on-chain. Check back soon.");
    return;
  }
  const sol = (window as unknown as { solana?: SolanaProvider }).solana;
  if (!sol?.connect) {
    window.open("https://phantom.app/", "_blank");
    setError("Install Phantom or Backpack to subscribe with $SENT or USDC.");
    return;
  }
  try {
    const resp = await sol.connect();
    window.location.href = `/dashboard/billing?tier=${tier.tier}&token=${offer.token}&planId=${offer.planId}&subscriber=${resp.publicKey.toString()}`;
  } catch (e: unknown) {
    const err = e as { message?: string };
    setError(err?.message || "Wallet connection failed");
  }
}

export function PricingSection() {
  const [data, setData] = useState<PlansResponse | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("/api/subscriptions/plans")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError("Could not load plans."));
  }, []);

  const tiers = data?.tiers ?? [];

  return (
    <section id="pricing" className="relative py-20 sm:py-28 lg:py-32 bg-white border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="max-w-2xl mx-auto text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            On-chain subscriptions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Pay in USDC or $SENT directly from your Solana wallet. No payment processor, no card on file.
            Cancel any time by revoking the on-chain authorization.
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-steel">
            Powered by Solana Subscriptions & Allowances · {data?.network ?? "devnet"}
          </p>
          <p className="mt-2 font-mono text-[10px] text-amber-600">
            Pre-alpha — plans not yet provisioned on mainnet. Devnet demo only.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {tiers.length === 0 && (
            <div className="md:col-span-3 text-center text-sm text-muted-foreground font-mono py-12">
              <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
              Loading plans...
            </div>
          )}

          {tiers.map((tier, i) => {
            const usdc = tier.tokens.find((t) => t.token === "USDC");
            const sent = tier.tokens.find((t) => t.token === "SENT");
            const isHi = highlighted(tier.tier);
            return (
              <motion.div
                key={tier.tier}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className={`relative rounded-lg border p-6 sm:p-8 flex flex-col ${
                  isHi
                    ? "border-sentinels/40 bg-sentinels/5 shadow-md"
                    : "border-border bg-white"
                }`}
              >
                {isHi && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] font-semibold uppercase tracking-widest text-sentinels bg-white border border-sentinels/30 px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="font-mono text-sm font-semibold tracking-widest text-steel uppercase">{tier.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    {tier.usdMonthly === null ? (
                      <span className="text-4xl font-bold text-foreground">Custom</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-foreground">${tier.usdMonthly}</span>
                        <span className="font-mono text-sm text-muted-foreground">/month</span>
                      </>
                    )}
                  </div>
                  {usdc && usdc.amountDisplay !== "Custom" && (
                    <div className="mt-2 font-mono text-xs text-muted-foreground">
                      = {usdc.amountDisplay} USDC
                    </div>
                  )}
                  {sent && sent.amountDisplay !== "Custom" && (
                    <div className="font-mono text-xs text-sentinels">
                      or {sent.amountDisplay} SENT (20% off)
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5">
                      <Check className={`h-4 w-4 shrink-0 mt-0.5 ${isHi ? "text-sentinels" : "text-emerald-500"}`} strokeWidth={2.5} />
                      <span className="text-sm text-foreground">{perk}</span>
                    </li>
                  ))}
                </ul>

                {tier.tier === "enterprise" ? (
                  <Button
                    className="w-full font-mono text-sm h-11 bg-foreground hover:bg-foreground/90 text-background"
                    asChild
                  >
                    <a href="#cta">Contact Sales</a>
                  </Button>
                ) : (
                  <div className="space-y-2">
                    {sent && (
                      <Button
                        onClick={() => handleSubscribe(tier, sent, setError)}
                        className={`w-full font-mono text-sm h-11 ${
                          isHi
                            ? "bg-sentinels hover:bg-sentinels-muted text-sentinels-foreground"
                            : "bg-foreground hover:bg-foreground/90 text-background"
                        }`}
                      >
                        Subscribe with $SENT
                      </Button>
                    )}
                    {usdc && (
                      <Button
                        variant="outline"
                        onClick={() => handleSubscribe(tier, usdc, setError)}
                        className="w-full font-mono text-sm h-11"
                      >
                        Subscribe with USDC
                      </Button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {error && (
          <p className="mt-6 text-center text-xs text-red-500 font-mono">{error}</p>
        )}
      </div>
    </section>
  );
}
