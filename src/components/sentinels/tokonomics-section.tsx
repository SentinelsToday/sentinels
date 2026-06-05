"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Coins, Zap, Lock, Users, Cpu, Globe, ArrowRight, Wallet,
  ExternalLink, Copy, Check,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

const useCases = [
  {
    icon: Cpu,
    title: "Compute Payments",
    desc: "Robots autonomously pay for compute, map data, and API services using $SENT — no human intervention needed.",
  },
  {
    icon: Zap,
    title: "Staking & Trust",
    desc: "Stake $SENT to boost your fleet's trust score. Higher stake = higher reputation in the network.",
  },
  {
    icon: Users,
    title: "Governance",
    desc: "Holders vote on protocol upgrades, fee structures, and network parameters. Your stake is your voice.",
  },
  {
    icon: Globe,
    title: "Cross-Fleet Trade",
    desc: "Robots from different fleets exchange services and data via $SENT — a universal token for machine economies.",
  },
  {
    icon: Wallet,
    title: "Machine Wallets",
    desc: "Every robot gets a $SENT wallet for autonomous spending — capped per mission, auditable on-chain.",
  },
  {
    icon: Lock,
    title: "Incentives & Rewards",
    desc: "Earn $SENT for contributing verified telemetry, reporting bugs, or running trusted nodes.",
  },
];

const SENT_ADDRESS = "DYrWewaqjmiMpnTh8SGzfo9NkiTzFckTTmnRMDQypump";

export function TokonomicsSection() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(SENT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = SENT_ADDRESS;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <section id="tokonomics" className="relative py-20 sm:py-28 lg:py-32 bg-surface border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="max-w-2xl mx-auto text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-1.5 rounded border border-sentinels/20 bg-sentinels/5 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-sentinels mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-sentinels" />
            $SENT Token
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mt-3">
            Tokonomics
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Powering the machine economy — $SENT is the native token for compute, trust, and governance across the Sentinels network.
          </p>
        </motion.div>

        {/* CA Badge — opens popup */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex justify-center mb-12"
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-sentinels/20 bg-white px-4 py-2 shadow-sm hover:border-sentinels/40 hover:shadow-md transition-all cursor-pointer"
          >
            <Coins className="h-4 w-4 text-sentinels" />
            <span className="font-mono text-xs text-muted-foreground">
              CA: {SENT_ADDRESS.slice(0, 4)}...{SENT_ADDRESS.slice(-4)}
            </span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogTitle className="font-mono text-sm tracking-wide">
                $SENT Token Address
              </DialogTitle>
              <DialogDescription className="sr-only">
                Contract address for the $SENT token on Solana
              </DialogDescription>
              <div
                role="button"
                tabIndex={0}
                onClick={handleCopy}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleCopy(); }}
                className="mt-2 w-full rounded-lg border border-border bg-surface p-4 font-mono text-xs break-all text-foreground cursor-pointer hover:border-sentinels/40 hover:bg-sentinels/5 transition-colors select-all"
              >
                {SENT_ADDRESS}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-mono text-xs text-foreground hover:bg-secondary transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Address"}
                </button>
                <a
                  href={`https://solscan.io/token/${SENT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-mono text-xs text-foreground hover:bg-secondary transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View on Solscan
                </a>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {useCases.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="group rounded-lg border border-border bg-white p-6 transition-all duration-200 hover:border-sentinels/40 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-sentinels/10 text-sentinels transition-colors group-hover:bg-sentinels/20">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mt-12 text-center"
        >
          <p className="font-mono text-xs text-muted-foreground">
            $SENT is live on Solana. View the contract on Solscan.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
