"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink, Loader2, Wallet } from "lucide-react";
import { NETWORK } from "@/lib/subscriptions";
import { getWallet } from "@/lib/wallet-tx";

interface SubscriptionRow {
  tier: "starter" | "fleet" | "enterprise";
  token: "USDC" | "SENT";
  planId: string;
  planPda: string;
  delegationPda: string;
  active: boolean;
}

interface MeResponse {
  subscriber: string;
  subscriptions: SubscriptionRow[];
}

function solscanAccount(addr: string) {
  const cluster = NETWORK === "mainnet-beta" ? "" : `?cluster=${NETWORK}`;
  return `https://solscan.io/account/${addr}${cluster}`;
}

function tierLabel(tier: SubscriptionRow["tier"]) {
  return { starter: "Starter", fleet: "Fleet", enterprise: "Enterprise" }[tier];
}

function readStoredSubscriber(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("sentinels-subscriber");
}

export function SubscriptionCard() {
  const [subscriber, setSubscriber] = useState<string | null>(readStoredSubscriber);
  const [connectError, setConnectError] = useState<string>("");

  useEffect(() => {
    if (subscriber) window.localStorage.setItem("sentinels-subscriber", subscriber);
  }, [subscriber]);

  const { data, isLoading, error } = useQuery<MeResponse>({
    enabled: !!subscriber,
    queryKey: ["subscriptions-me", subscriber],
    queryFn: async () => {
      const r = await fetch(`/api/subscriptions/me?subscriber=${encodeURIComponent(subscriber!)}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    },
  });

  async function connectWallet() {
    const wallet = getWallet();
    if (!wallet?.connect) {
      window.open("https://phantom.app/", "_blank");
      setConnectError("Install Phantom or Backpack to view subscriptions.");
      return;
    }
    try {
      const { publicKey } = await wallet.connect();
      setSubscriber(publicKey.toString());
      setConnectError("");
    } catch {
      setConnectError("Wallet connection rejected.");
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-mono uppercase text-neutral-500 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Subscription
        </CardTitle>
        <Link
          href="/dashboard/billing"
          className="text-xs font-mono text-neutral-500 hover:text-[#111113]"
        >
          Manage →
        </Link>
      </CardHeader>
      <CardContent>
        {!subscriber && (
          <div className="text-center py-6">
            <Wallet className="h-6 w-6 text-neutral-400 mx-auto mb-3" />
            <p className="text-sm text-neutral-600 mb-3">
              Connect your wallet to view your active subscriptions.
            </p>
            <Button variant="outline" size="sm" onClick={connectWallet} className="font-mono text-xs">
              Connect Wallet
            </Button>
            {connectError && (
              <p className="mt-3 text-xs text-red-500 font-mono">{connectError}</p>
            )}
          </div>
        )}

        {subscriber && isLoading && (
          <div className="flex items-center justify-center py-6 text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Reading on-chain...
          </div>
        )}

        {subscriber && error && (
          <div className="text-center py-6">
            <p className="text-sm text-red-500 font-mono">{(error as Error).message}</p>
          </div>
        )}

        {subscriber && !isLoading && !error && data && data.subscriptions.length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-neutral-600 mb-3">
              No active subscription for{" "}
              <span className="font-mono text-xs">
                {subscriber.slice(0, 4)}...{subscriber.slice(-4)}
              </span>
            </p>
            <Link href="/pricing">
              <Button size="sm" className="bg-[#E8553D] hover:bg-[#d14a34] text-white font-mono text-xs">
                Choose a plan
              </Button>
            </Link>
          </div>
        )}

        {subscriber && !isLoading && !error && data && data.subscriptions.length > 0 && (
          <div className="space-y-3">
            {data.subscriptions.map((sub) => (
              <div
                key={sub.delegationPda}
                className="flex items-center justify-between border border-neutral-200 rounded-md px-4 py-3 bg-neutral-50/40"
              >
                <div>
                  <div className="font-medium text-[#111113] text-sm">
                    {tierLabel(sub.tier)}{" "}
                    <span className="text-neutral-500 font-mono text-xs">· {sub.token}</span>
                    {sub.token === "SENT" && (
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-[#E8553D]">
                        20% off
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                    Plan #{sub.planId} · Every 30 days · {sub.active ? "Active" : "Plan ended"}
                  </div>
                </div>
                <a
                  href={solscanAccount(sub.delegationPda)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-neutral-500 hover:text-[#E8553D]"
                >
                  On-chain <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
