"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/sentinels/header";
import { Footer } from "@/components/sentinels/footer";
import {
  Terminal,
  Code2,
  Shield,
  Boxes,
  Activity,
  Wallet,
  Cpu,
  ArrowRight,
  Search,
  FileText,
  Webhook,
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const sections = [
  {
    title: "Getting Started",
    icon: Terminal,
    links: [
      { title: "Quick Start Guide", desc: "Register your first robot in 5 minutes", href: "/docs/quick-start" },
      { title: "Installation", desc: "Install the SDK and CLI for your platform", href: "/docs/quick-start" },
      { title: "Authentication", desc: "API keys, JWT tokens, and wallet auth", href: "/docs/authentication" },
      { title: "First Robot", desc: "Register, verify, and monitor a robot", href: "/docs/robot-registration" },
    ],
  },
  {
    title: "Robot Identity",
    icon: Shield,
    links: [
      { title: "DID Registration", desc: "Create decentralized identifiers for robots", href: "/docs/robot-registration" },
      { title: "Key Management", desc: "Ed25519 keypairs, rotation, and revocation", href: "/docs/robot-registration" },
      { title: "Hardware Attestation", desc: "TPM, Secure Enclave, and SGX integration", href: "/docs/robot-registration" },
      { title: "Identity Verification", desc: "Verify robot identity in your application", href: "/docs/authentication" },
    ],
  },
  {
    title: "Trust Verification",
    icon: Activity,
    links: [
      { title: "Firmware Verification", desc: "Hash, sign, and verify firmware integrity", href: "/docs/firmware-verification" },
      { title: "Telemetry Signing", desc: "Cryptographically sign telemetry data points", href: "/docs/telemetry-signing" },
      { title: "Trust Scoring", desc: "Understand and configure trust score factors", href: "/docs/telemetry-signing" },
      { title: "Anomaly Detection", desc: "Configure alerts for unusual behavior", href: "/docs/telemetry-signing" },
    ],
  },
  {
    title: "Fleet Management",
    icon: Boxes,
    links: [
      { title: "Fleet Dashboard", desc: "Monitor and manage your robot fleet", href: "/docs/fleet-commands" },
      { title: "Commands", desc: "Send verified commands to robots", href: "/docs/fleet-commands" },
      { title: "OTA Updates", desc: "Deploy firmware with verification pipeline", href: "/docs/firmware-verification" },
      { title: "Webhooks", desc: "Real-time event notifications", href: "/docs/fleet-commands" },
    ],
  },
  {
    title: "Blockchain",
    icon: Wallet,
    links: [
      { title: "Solana Integration", desc: "Anchor proofs and verify on-chain records", href: "/docs/firmware-verification" },
      { title: "Robot Wallets", desc: "Create and manage machine wallets", href: "/docs/firmware-verification" },
      { title: "On-Chain Proofs", desc: "Store and retrieve verification proofs", href: "/docs/firmware-verification" },
      { title: "Transaction History", desc: "Query robot transaction records", href: "/docs/firmware-verification" },
    ],
  },
  {
    title: "API Reference",
    icon: Code2,
    links: [
      { title: "REST API", desc: "Complete REST API reference with examples", href: "/developers" },
      { title: "WebSocket API", desc: "Real-time streaming endpoints", href: "/developers" },
      { title: "gRPC API", desc: "High-performance binary protocol", href: "/developers" },
      { title: "Error Codes", desc: "Error handling and troubleshooting", href: "/developers" },
    ],
  },
];

const quickLinks = [
  { icon: Terminal, title: "CLI Reference", desc: "All CLI commands and flags" },
  { icon: Webhook, title: "Webhook Events", desc: "Event types and payloads" },
  { icon: Cpu, title: "Edge SDK", desc: "Embedded device integration" },
  { icon: FileText, title: "Changelog", desc: "Latest updates and releases" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative grid-bg py-16 sm:py-20 bg-white border-b border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                Documentation
              </h1>
              <p className="mt-4 max-w-xl mx-auto text-base text-muted-foreground leading-relaxed">
                Everything you need to integrate Sentinels into your robotics infrastructure.
              </p>
              {/* Search */}
              <div className="mt-8 max-w-md mx-auto">
                <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-3 focus-within:border-sentinels/40 transition-colors">
                  <Search className="h-4 w-4 text-steel shrink-0" />
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <kbd className="hidden sm:inline-flex font-mono text-[10px] text-steel border border-border rounded px-1.5 py-0.5">âŒ˜K</kbd>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-8 bg-surface border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <div key={link.title} className="group flex items-center gap-3 rounded-md border border-border bg-white px-4 py-3 transition-colors hover:border-sentinels/40 cursor-pointer">
                    <Icon className="h-4 w-4 text-steel group-hover:text-sentinels transition-colors" strokeWidth={1.8} />
                    <div>
                      <p className="font-mono text-xs font-semibold text-foreground">{link.title}</p>
                      <p className="text-[11px] text-muted-foreground">{link.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section, i) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } } }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className="h-4 w-4 text-sentinels" strokeWidth={1.8} />
                      <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground">{section.title}</h3>
                    </div>
                    <div className="space-y-1">
                      {section.links.map((link) => (
                        <Link
                          key={link.title}
                          href={link.href}
                          className="group flex items-center justify-between rounded-md px-3 py-2.5 transition-colors hover:bg-surface"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground group-hover:text-sentinels transition-colors">{link.title}</p>
                            <p className="text-[12px] text-muted-foreground">{link.desc}</p>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-steel opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Start Terminal */}
        <section className="py-16 sm:py-20 bg-surface border-t border-border">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Quick Start</h2>
                <p className="mt-2 text-sm text-muted-foreground">Get your first robot verified in under 5 minutes.</p>
              </div>
              <div className="rounded-lg border border-border bg-[#1A1A1D] overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#333] bg-[#111113]">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-gray-500 tracking-wider">quick-start</span>
                </div>
                <div className="overflow-x-auto">
                  <div className="px-5 py-4 font-mono text-[13px] leading-7 whitespace-nowrap">
                    <div><span className="text-gray-500"># Install the CLI</span></div>
                    <div><span className="text-gray-300">$ </span><span className="text-gray-200">curl -fsSL https://get.sentinels.dev | sh</span></div>
                    <div className="mt-2"><span className="text-gray-500"># Authenticate</span></div>
                    <div><span className="text-gray-300">$ </span><span className="text-gray-200">sentinels auth login</span></div>
                    <div className="mt-2"><span className="text-gray-500"># Initialize project</span></div>
                    <div><span className="text-gray-300">$ </span><span className="text-gray-200">sentinels init --project my-fleet</span></div>
                    <div><span className="text-[#E8553D]">â†’ </span><span className="text-gray-400">Created sentinels.yaml</span></div>
                    <div className="mt-2"><span className="text-gray-500"># Register your first robot</span></div>
                    <div><span className="text-gray-300">$ </span><span className="text-gray-200">sentinels register --name unit-001 --model forklift</span></div>
                    <div><span className="text-emerald-400">âœ“ </span><span className="text-gray-400">Robot registered â€” DID: did:sentinels:0x...</span></div>
                    <div><span className="text-emerald-400">âœ“ </span><span className="text-gray-400">Trust score: 100/100</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
