"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const terminalLines = [
  { prefix: "$ ", text: "sentinel register --robot unit-0042", color: "text-foreground", delay: 300 },
  { prefix: "→ ", text: "Generating Ed25519 keypair...", color: "text-steel", delay: 800 },
  { prefix: "→ ", text: "Registering DID: did:sentinel:0x7f3a...b2c1", color: "text-steel", delay: 1200 },
  { prefix: "→ ", text: "Firmware hash: SHA-256:a4e8f...91cd", color: "text-steel", delay: 1600 },
  { prefix: "→ ", text: "Trust score: ████████░░ 82/100", color: "text-sentinel", delay: 2000 },
  { prefix: "✓ ", text: "Robot unit-0042 verified and onboarded", color: "text-emerald-600", delay: 2600 },
];

const stats = [
  { value: "1.2M+", label: "Robots Verified" },
  { value: "99.97%", label: "Uptime SLA" },
  { value: "<50ms", label: "Auth Latency" },
];

const partners = ["Solana", "NATS", "ROS 2", "MQTT"];

const CHAR_SPEED = 35;

function TypewriterText({ text, onComplete, startDelay }: { text: string; onComplete: () => void; startDelay: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (displayed >= text.length) {
        onComplete();
        return;
      }
      const charTimer = setTimeout(() => setDisplayed((c) => c + 1), CHAR_SPEED);
      return () => clearTimeout(charTimer);
    }, displayed === 0 ? startDelay : 0);
    return () => clearTimeout(delayTimer);
  }, [displayed, text, onComplete, startDelay]);

  return <span className="whitespace-pre-wrap break-all">{text.slice(0, displayed)}</span>;
}

function AnimatedTerminalLines({ lines }: { lines: typeof terminalLines }) {
  const [completedLines, setCompletedLines] = useState<Set<number>>(new Set());
  const [showCursor, setShowCursor] = useState(true);
  const allDone = completedLines.size >= lines.length;

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {lines.map((line, i) => {
        const isComplete = completedLines.has(i);
        const isActive = i === completedLines.size;
        if (!isComplete && !isActive) return null;

        return (
          <motion.div
            key={i}
            className={`flex ${line.color}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="select-none shrink-0 text-gray-500 mr-1">{line.prefix}</span>
            {isComplete ? (
              <span className="whitespace-pre-wrap break-all">{line.text}</span>
            ) : (
              <TypewriterText
                text={line.text}
                startDelay={line.delay}
                onComplete={() => setCompletedLines((prev) => new Set(prev).add(i))}
              />
            )}
            {isActive && (
              <span
                className={`inline-block w-[7px] h-[14px] bg-foreground/70 ml-0.5 align-middle ${showCursor ? "opacity-100" : "opacity-0"}`}
                style={{ transition: "opacity 0.1s" }}
              />
            )}
          </motion.div>
        );
      })}
      {allDone && (
        <span
          className={`inline-block w-[7px] h-[14px] bg-foreground/70 ml-0.5 align-middle ${showCursor ? "opacity-100" : "opacity-0"}`}
          style={{ transition: "opacity 0.1s" }}
        />
      )}
    </div>
  );
}

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
            <span className="text-sentinel">Autonomous Machines</span>
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
            className="font-mono text-sm bg-sentinel hover:bg-sentinel-muted text-sentinel-foreground h-11 px-6"
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
          <div className="rounded-lg border border-border bg-[#1A1A1D] overflow-hidden shadow-lg">
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#333] bg-[#111113]">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              <span className="ml-3 font-mono text-[11px] text-gray-500 tracking-wide">
                sentinel-cli — register
              </span>
            </div>

            {/* Terminal body */}
            <div className="px-5 py-4 font-mono text-[13px] leading-7 min-h-[176px]">
              <AnimatedTerminalLines lines={terminalLines} />
            </div>
          </div>
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
            Built on
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
