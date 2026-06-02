"use client";

import { motion } from "framer-motion";
import {
  Power,
  Fingerprint,
  FileCheck,
  KeyRound,
  BadgeCheck,
  Shield,
  RefreshCw,
  Cpu,
  FileSignature,
} from "lucide-react";

const pipelineSteps = [
  { label: "Robot Boot", icon: Power },
  { label: "Hardware Attestation", icon: Fingerprint },
  { label: "DID Registration", icon: FileCheck },
  { label: "Keypair Generation", icon: KeyRound },
  { label: "Trust Token Issued", icon: BadgeCheck },
];

const featureCards = [
  {
    title: "Decentralized ID",
    description: "W3C DID standard compliant identities with on-chain registration on Solana",
    icon: Shield,
  },
  {
    title: "Key Rotation",
    description: "Automatic cryptographic key rotation with zero-downtime transition",
    icon: RefreshCw,
  },
  {
    title: "Hardware Attestation",
    description: "TPM and Secure Enclave backed identity verification",
    icon: Cpu,
  },
  {
    title: "Signed Telemetry",
    description: "Every data point cryptographically signed and timestamped",
    icon: FileSignature,
  },
];

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stepVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const connectorVariants = {
  hidden: { scaleY: 0 },
  visible: (i: number) => ({
    scaleY: 1,
    transition: { delay: i * 0.12 + 0.08, duration: 0.35, ease: "easeOut" },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export function RobotIdentitySection() {
  return (
    <section id="platform" className="relative grid-bg py-20 sm:py-28 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
          className="mb-14 sm:mb-18 max-w-2xl"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <span className="inline-flex items-center gap-1.5 rounded border border-sentinels/20 bg-sentinels/5 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-sentinels">
              <span className="h-1.5 w-1.5 rounded-full bg-sentinels" />
              Identity Engine
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Cryptographic Robot Identity
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
            Every robot receives a decentralized identity, cryptographic keypair, and hardware-backed attestation. Built on DID standards with Ed25519 cryptography.
          </motion.p>
        </motion.div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* LEFT â€” Pipeline */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="relative">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel">Auth Pipeline</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-col">
              {pipelineSteps.map((step, i) => {
                const isLast = i === pipelineSteps.length - 1;
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex flex-col">
                    <motion.div
                      custom={i}
                      variants={stepVariants}
                      className={`group flex items-center gap-3.5 rounded-md border px-4 py-3 transition-colors duration-200 ${
                        isLast
                          ? "border-sentinels/30 bg-sentinels/5 hover:border-sentinels/60"
                          : "border-border bg-white hover:border-graphite"
                      }`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${
                        isLast
                          ? "bg-sentinels/10 text-sentinels"
                          : "bg-secondary text-steel group-hover:text-foreground transition-colors"
                      }`}>
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <span className={`font-mono text-sm tracking-wide ${
                        isLast ? "font-semibold text-sentinels" : "font-medium text-foreground"
                      }`}>
                        {step.label}
                      </span>
                      <span className="ml-auto font-mono text-[10px] text-steel tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </motion.div>
                    {!isLast && (
                      <motion.div custom={i} variants={connectorVariants} className="ml-[1.55rem] h-6 w-px origin-top bg-border" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT â€” Feature Cards */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 self-start">
            {featureCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  custom={i}
                  variants={cardVariants}
                  className="group rounded-md border border-border bg-white p-5 transition-colors duration-200 hover:border-sentinels/40 hover:shadow-sm"
                >
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded bg-secondary text-steel transition-colors group-hover:bg-sentinels/10 group-hover:text-sentinels">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <h3 className="mb-1.5 text-sm font-bold tracking-tight text-foreground">{card.title}</h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{card.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
