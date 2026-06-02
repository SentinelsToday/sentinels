"use client";

import { motion } from "framer-motion";
import {
  Hammer,
  Hash,
  FileSignature,
  Send,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
  Link2,
  Lock,
} from "lucide-react";
import { TerminalWindow } from "@/components/terminal";

const pipelineSteps = [
  { step: 1, label: "FIRMWARE BUILD", sublabel: "Source compile", icon: Hammer },
  { step: 2, label: "HASH GENERATION", sublabel: "SHA-256 / Blake3", icon: Hash },
  { step: 3, label: "SIGN & ANCHOR", sublabel: "On Solana", icon: FileSignature },
  { step: 4, label: "DISTRIBUTION", sublabel: "Secure deploy", icon: Send },
  { step: 5, label: "VERIFICATION", sublabel: "Boot check", icon: ShieldCheck },
  { step: 6, label: "TRUST TOKEN", sublabel: "Verified", icon: BadgeCheck, accent: true },
];

const codeLines = [
  { type: "comment", text: "// Firmware verification check" },
  { type: "keyword", text: "const ", suffix: "proof ", eq: "= ", call: "await sentinels.verifyFirmware({" },
  { type: "indent", key: "robotId", value: '"unit-0042",' },
  { type: "indent", key: "version", value: '"2.4.1",' },
  { type: "indent", key: "hash", value: '"SHA-256:a4e8f...91cd",' },
  { type: "indent", key: "chainProof", value: '"0x7f3a...b2c1"' },
  { type: "plain", text: "});" },
  { type: "comment", text: "// proof.verified â†’ true" },
  { type: "comment", text: "// proof.trustScore â†’ 94" },
];

const features = [
  { icon: Link2, title: "On-Chain Proofs", description: "Firmware hashes anchored on Solana for immutable verification records" },
  { icon: Lock, title: "Zero-Trust Boot", description: "Every boot cycle re-verifies firmware integrity before execution" },
];

const stepVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function PipelineStep({ step, isLast }: { step: (typeof pipelineSteps)[number]; isLast: boolean }) {
  const Icon = step.icon;
  const isAccent = step.accent;

  return (
    <motion.div variants={stepVariants} className="flex items-center gap-0">
      <div className={`relative flex flex-col items-center gap-3 px-4 py-5 sm:px-5 sm:py-6 border rounded-md min-w-[120px] sm:min-w-[140px] transition-colors group ${
        isAccent
          ? "bg-sentinels/5 border-sentinels/30 hover:border-sentinels/60"
          : "bg-white border-border hover:border-graphite"
      }`}>
        <span className={`absolute top-2 right-2.5 font-mono text-[10px] tracking-widest ${
          isAccent ? "text-sentinels/70" : "text-steel"
        }`}>
          {String(step.step).padStart(2, "0")}
        </span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${
          isAccent
            ? "bg-sentinels/10 text-sentinels"
            : "bg-secondary text-steel group-hover:text-foreground"
        } transition-colors`}>
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div className="text-center">
          <p className={`font-mono text-[11px] sm:text-xs font-semibold tracking-wider ${
            isAccent ? "text-sentinels" : "text-foreground"
          }`}>
            {step.label}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground mt-1 tracking-wide">{step.sublabel}</p>
        </div>
      </div>

      {!isLast && (
        <div className="flex items-center px-1 sm:px-2 shrink-0">
          <div className="hidden sm:flex items-center gap-0">
            <div className="h-px w-4 sm:w-6 bg-graphite" />
            <ArrowRight className="h-3.5 w-3.5 text-steel" />
            <div className="h-px w-4 sm:w-6 bg-graphite" />
          </div>
          <div className="flex sm:hidden items-center">
            <ArrowRight className="h-3.5 w-3.5 text-steel rotate-90" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function CodeBlock() {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <TerminalWindow title="verify.ts">
        <div className="overflow-x-auto">
          {codeLines.map((line, i) => {
            if (line.type === "comment") return <div key={i}><span className="text-gray-500">{line.text}</span></div>;
            if (line.type === "keyword") return (
              <div key={i}>
                <span className="text-[#E8553D]">{line.text}</span>
                <span className="text-gray-200">{line.suffix}</span>
                <span className="text-[#E8553D]">{line.eq}</span>
                <span className="text-gray-300">{line.call}</span>
              </div>
            );
            if (line.type === "indent") return (
              <div key={i} className="pl-4">
                <span className="text-gray-200">{line.key}</span>
                <span className="text-gray-500">: </span>
                <span className="text-emerald-400">{line.value}</span>
              </div>
            );
            if (line.type === "plain") return <div key={i}><span className="text-gray-300">{line.text}</span></div>;
            return null;
          })}
        </div>
      </TerminalWindow>
    </motion.div>
  );
}

export function FirmwareSection() {
  return (
    <section id="firmware" className="relative py-20 sm:py-28 lg:py-32 bg-white border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUpVariants}
          className="max-w-2xl mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-1.5 rounded border border-sentinels/20 bg-sentinels/5 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-sentinels mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-sentinels" />
            Trust Engine
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mt-3">
            Firmware Verification Pipeline
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xl">
            Every firmware update is hashed, signed, and anchored to Solana. Robots boot only with verified, untampered firmware â€” from flash to execution.
          </p>
        </motion.div>

        {/* Pipeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-12 sm:mb-16"
        >
          <div className="flex flex-wrap justify-center gap-y-4 sm:gap-y-0">
            <div className="flex items-center justify-center w-full sm:w-auto">
              {pipelineSteps.slice(0, 3).map((step, idx) => (
                <PipelineStep key={step.step} step={step} isLast={idx === 2} />
              ))}
            </div>
            <div className="flex sm:hidden items-center justify-center w-full py-1">
              <div className="flex items-center">
                <div className="h-6 w-px bg-graphite" />
                <ArrowRight className="h-3.5 w-3.5 text-steel rotate-90" />
              </div>
            </div>
            <div className="flex items-center justify-center w-full sm:w-auto">
              <div className="hidden sm:flex items-center px-1 sm:px-2 shrink-0">
                <div className="h-px w-4 sm:w-6 bg-graphite" />
                <ArrowRight className="h-3.5 w-3.5 text-steel" />
                <div className="h-px w-4 sm:w-6 bg-graphite" />
              </div>
              {pipelineSteps.slice(3).map((step, idx) => (
                <PipelineStep key={step.step} step={step} isLast={idx === 2} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Code block */}
        <div className="mb-12 sm:mb-16 max-w-2xl mx-auto lg:mx-0">
          <CodeBlock />
        </div>

        {/* Features */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group flex gap-4 p-5 sm:p-6 border border-border rounded-md bg-white hover:border-sentinels/40 hover:shadow-sm transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-steel group-hover:bg-sentinels/10 group-hover:text-sentinels transition-colors">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground">{feature.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
