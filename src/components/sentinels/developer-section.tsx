"use client";

import { motion } from "framer-motion";
import {
  Terminal,
  Code2,
  BookOpen,
  Webhook,
  KeyRound,
  Boxes,
} from "lucide-react";
import { TerminalWindow, TerminalSequence } from "@/components/terminal";
import type { SequenceStep } from "@/components/terminal";

const sdks = [
  { name: "Rust", lang: "rust", description: "Primary SDK for robotics runtime and edge devices" },
  { name: "Python", lang: "python", description: "AI/ML integration and data analysis pipelines" },
  { name: "Go", lang: "go", description: "Fleet management services and backend integrations" },
  { name: "TypeScript", lang: "ts", description: "Dashboard and web application development" },
];

const apiFeatures = [
  { icon: KeyRound, title: "Authentication", desc: "JWT, wallet-based, and hardware attestation auth flows", endpoint: "POST /v1/auth/verify" },
  { icon: Boxes, title: "Robot Management", desc: "Register, update, and manage your robot fleet", endpoint: "GET /v1/robots" },
  { icon: Webhook, title: "Webhooks", desc: "Real-time event notifications for trust and status changes", endpoint: "POST /v1/webhooks" },
  { icon: Terminal, title: "CLI Tools", desc: "Command-line interface for automation and scripting", endpoint: "$ sentinels deploy" },
];

const cliSteps: SequenceStep[] = [
  { type: "command", text: "sentinels init --project warehouse-alpha", delay: 150 },
  { type: "output", text: "Created project config at sentinels.yaml" },
  { type: "output", text: "Generated API keys for staging" },
  { type: "command", text: "sentinels register --robot unit-0042 --type forklift", delay: 200 },
  { type: "output", text: "DID: did:sentinels:0x7f3a...b2c1" },
  { type: "output", text: "Keypair: Ed25519 (stored in hardware enclave)" },
  { type: "output", text: "Trust score: 100/100" },
  { type: "command", text: "sentinels deploy --firmware v2.4.1 --fleet warehouse", delay: 200 },
  { type: "output", text: "Hashing firmware... SHA-256:a4e8f...91cd" },
  { type: "output", text: "Signing with project key... done" },
  { type: "output", text: "Anchoring on Solana... slot 258491032" },
  { type: "success", text: "Deploying to 247 robots... âœ“" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export function DeveloperSection() {
  return (
    <section id="developers" className="relative grid-bg py-20 sm:py-28 lg:py-32 bg-surface border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-1.5 rounded border border-sentinels/20 bg-sentinels/5 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-sentinels mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-sentinels" />
            Developer Experience
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mt-3">
            Built for Engineers
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            First-class SDKs, a powerful CLI, and a RESTful API. Integrate Sentinels into your robotics stack in minutes, not months.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* SDKs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
          >
            <div className="mb-6 flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">SDKs</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {sdks.map((sdk) => (
                <div key={sdk.name} className="group rounded-md border border-border bg-white p-4 transition-colors duration-200 hover:border-sentinels/40 hover:shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Code2 className="h-4 w-4 text-sentinels" strokeWidth={1.8} />
                    <span className="font-mono text-sm font-semibold text-foreground">{sdk.name}</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{sdk.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CLI Example */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
          >
            <div className="mb-6 flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">CLI</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <TerminalWindow title="sentinels-cli">
              <TerminalSequence steps={cliSteps} />
            </TerminalWindow>
          </motion.div>
        </div>

        {/* API features */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
        >
          <div className="mb-8 flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">API Endpoints</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {apiFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                  className="group flex gap-4 p-5 border border-border rounded-md bg-white hover:border-sentinels/40 hover:shadow-sm transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-steel group-hover:bg-sentinels/10 group-hover:text-sentinels transition-colors">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                    <code className="mt-2 block font-mono text-[11px] text-sentinels bg-sentinels/5 px-2 py-1 rounded truncate">{feature.endpoint}</code>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Docs link */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-12 text-center"
        >
          <a href="/docs" className="inline-flex items-center gap-2 font-mono text-sm text-sentinels hover:text-sentinels-muted transition-colors group">
            <BookOpen className="h-4 w-4" />
            Read the full documentation
            <span className="group-hover:translate-x-1 transition-transform">â†’</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
