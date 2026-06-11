"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen } from "lucide-react";
import { TerminalWindow, TerminalSequence } from "@/components/terminal";
import type { SequenceStep } from "@/components/terminal";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const terminalSteps: SequenceStep[] = [
  { type: "command", text: "sentinels register --robot unit-0042", delay: 150 },
  { type: "output", text: "Generating Ed25519 keypair..." },
  { type: "output", text: "Registering DID: did:sentinels:0x7f3a...b2c1" },
  { type: "output", text: "Firmware hash: SHA-256:a4e8f...91cd" },
  { type: "output", text: "Trust score: â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘ 82/100", color: "text-sentinels" },
  { type: "success", text: "Robot unit-0042 verified and onboarded" },
];

const stats = [
  { value: "Pre-alpha", label: "Development Stage" },
  { value: "Coming Soon", label: "Early Access" },
  { value: "0.2.0", label: "Current Build" },
];

const partners = ["Solana", "NATS", "ROS 2", "MQTT"];

export function HeroSection() {
  return (
    <section className="relative min-h-screen grid-bg flex flex-col items-center justify-center overflow-hidden bg-white">
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center gap-10">
        {/* Headline */}
        <motion.div
          className="flex flex-col items-center gap-5"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.08]"
            variants={fadeUp}
          >
            Trust Infrastructure
            <br />
            for{" "}
            <span className="text-sentinels">Autonomous Machines</span>
          </motion.h1>

          <motion.p
            className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
            variants={fadeUp}
          >
            Cryptographic identity, secure telemetry, and verifiable fleet
            operations for robotics systems.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3"
          initial="hidden"
          animate="visible"
          custom={0.4}
          variants={fadeUp}
        >
          <Button
            size="lg"
            className="font-mono text-sm bg-sentinels hover:bg-sentinels-muted text-sentinels-foreground h-11 px-6"
            asChild
          >
            <a href="#cta">
              Request Access
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="font-mono text-sm h-11 px-6 border-border hover:border-muted-foreground"
            asChild
          >
            <a href="#developers">
              <BookOpen className="mr-1.5 h-4 w-4" />
              Read Docs
            </a>
          </Button>
        </motion.div>

        {/* Terminal block */}
        <motion.div
          className="w-full max-w-2xl"
          initial="hidden"
          animate="visible"
          custom={0.6}
          variants={fadeUp}
        >
          <TerminalWindow title="sentinels-cli â€” register">
            <TerminalSequence steps={terminalSteps} />
          </TerminalWindow>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl"
          initial="hidden"
          animate="visible"
          custom={0.9}
          variants={fadeUp}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-1 rounded-lg border border-border bg-surface px-4 py-5"
              custom={1.0 + i * 0.1}
              variants={fadeUp}
            >
              <span className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </span>
              <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Partner bar */}
      <motion.div
        className="relative z-10 w-full border-t border-border bg-surface"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase shrink-0">
            Planned Integrations
          </span>
          <div className="flex items-center gap-2">
            {partners.map((name) => (
              <Badge
                key={name}
                variant="outline"
                className="font-mono text-[11px] tracking-wide text-muted-foreground border-border hover:border-muted-foreground transition-colors px-2.5 py-1"
              >
                {name}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
