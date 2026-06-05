"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/sentinels/header";
import { Footer } from "@/components/sentinels/footer";
import {
  Shield,
  Fingerprint,
  Activity,
  Cpu,
  FileSignature,
  Wallet,
  ArrowRight,
  Lock,
  RefreshCw,
  Eye,
  Terminal,
  Boxes,
  Link2,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const modules = [
  {
    id: "identity",
    badge: "Module 01",
    title: "Robot Identity Engine",
    description: "Every robot receives a cryptographic identity â€” decentralized ID, Ed25519 keypair, hardware fingerprint, and secure wallet. Built on W3C DID standards.",
    icon: Fingerprint,
    features: [
      { icon: Shield, title: "DID Registration", desc: "W3C-compliant decentralized identifiers anchored on Solana" },
      { icon: RefreshCw, title: "Key Rotation", desc: "Automatic cryptographic key rotation with zero-downtime transition" },
      { icon: Cpu, title: "Hardware Attestation", desc: "TPM and Secure Enclave backed identity verification" },
      { icon: FileSignature, title: "Signed Actions", desc: "Every robot action cryptographically signed and verifiable" },
    ],
  },
  {
    id: "trust",
    badge: "Module 02",
    title: "Trust Verification Layer",
    description: "The platform verifies firmware integrity, software signatures, mission authenticity, and telemetry tampering. Your moat against compromised robots.",
    icon: Eye,
    features: [
      { icon: Lock, title: "Firmware Hash Registry", desc: "SHA-256 and Blake3 hashes for every firmware version" },
      { icon: Activity, title: "Trust Scoring", desc: "Dynamic 0-100 trust scores from behavior, attestation, and history" },
      { icon: Shield, title: "Tamper Detection", desc: "Real-time detection of modified telemetry or compromised firmware" },
      { icon: Eye, title: "Anomaly Detection", desc: "Statistical analysis flags unusual patterns in robot behavior" },
    ],
  },
  {
    id: "fleet",
    badge: "Module 03",
    title: "Fleet Command Platform",
    description: "Real-time dashboard to monitor robot health, location, mission status, software updates, trust alerts, and command execution across your entire fleet.",
    icon: Boxes,
    features: [
      { icon: Activity, title: "Real-Time Monitoring", desc: "WebSocket-powered live telemetry and status updates" },
      { icon: Terminal, title: "Remote Commands", desc: "Execute verified commands with full audit trail" },
      { icon: RefreshCw, title: "OTA Updates", desc: "Deploy firmware with rollback protection and verification" },
      { icon: Shield, title: "Trust Alerts", desc: "Instant notifications when trust scores drop below threshold" },
    ],
  },
  {
    id: "audit",
    badge: "Module 04",
    title: "Immutable Audit Layer",
    description: "Every important event is signed, timestamped, and immutable. Partially on-chain for verification, full data off-chain for performance. Enterprise compliance ready.",
    icon: Database,
    features: [
      { icon: FileSignature, title: "Signed Events", desc: "Every log entry cryptographically signed by the originating robot" },
      { icon: Link2, title: "On-Chain Proofs", desc: "Event hashes anchored on Solana for immutable verification" },
      { icon: Lock, title: "Tamper-Proof", desc: "Hash chains prevent retroactive modification of audit records" },
      { icon: Shield, title: "Compliance Export", desc: "SOC 2, ISO 27001, and defense-grade audit report generation" },
    ],
  },
  {
    id: "wallet",
    badge: "Module 05",
    title: "Robot Wallet System",
    description: "Each robot has a wallet address with payment permissions, staking capability, and API credits. Robots can autonomously buy compute, rent maps, and pay for services.",
    icon: Wallet,
    features: [
      { icon: Wallet, title: "Machine Wallets", desc: "Solana-based wallets with programmable spending limits" },
      { icon: Lock, title: "Permission System", desc: "Granular transaction permissions per robot and fleet" },
      { icon: Activity, title: "Usage Billing", desc: "Automated API credit management and consumption tracking" },
      { icon: Link2, title: "Autonomous Payments", desc: "Robots pay for compute, charging, and services independently" },
    ],
  },
];

export default function PlatformPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative grid-bg py-20 sm:py-28 lg:py-32 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <span className="inline-flex items-center gap-1.5 rounded border border-sentinels/20 bg-sentinels/5 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-sentinels mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-sentinels" />
                Platform Overview
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                The Complete Trust Stack
              </h1>
              <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
                Five integrated modules that give every robot cryptographic identity, verified firmware, real-time fleet management, immutable audit logs, and autonomous wallet capabilities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Modules */}
        {modules.map((mod, idx) => {
          const Icon = mod.icon;
          const isAlt = idx % 2 === 1;
          return (
            <section
              id={mod.id}
              key={mod.id}
              className={`relative py-20 sm:py-28 border-t border-border ${isAlt ? "bg-surface grid-bg-dense" : "bg-white"}`}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={fadeUp}
                  className="max-w-3xl mb-12"
                >
                  <span className="inline-flex items-center gap-1.5 rounded border border-sentinels/20 bg-sentinels/5 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-sentinels mb-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-sentinels" />
                    {mod.badge}
                  </span>
                  <div className="flex items-center gap-3 mt-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sentinels/10 text-sentinels">
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                      {mod.title}
                    </h2>
                  </div>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {mod.description}
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {mod.features.map((feature, i) => {
                    const FIcon = feature.icon;
                    return (
                      <motion.div
                        key={feature.title}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={i}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
                        }}
                        className={`group flex gap-4 p-5 sm:p-6 border border-border rounded-md transition-colors duration-200 hover:border-sentinels/40 hover:shadow-sm ${isAlt ? "bg-white" : "bg-surface"}`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-steel transition-colors group-hover:bg-sentinels/10 group-hover:text-sentinels">
                          <FIcon className="h-5 w-5" strokeWidth={1.8} />
                        </div>
                        <div>
                          <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground">{feature.title}</h3>
                          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <section className="py-20 sm:py-28 bg-white border-t border-border">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Ready to secure your fleet?
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Get started with Sentinels in minutes. No credit card required for the starter tier.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="font-mono text-sm bg-sentinels hover:bg-sentinels-muted text-white h-11 px-6" asChild>
                  <Link href="/pricing">
                    View Pricing
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="font-mono text-sm h-11 px-6" asChild>
                  <Link href="/docs">Read Documentation</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
