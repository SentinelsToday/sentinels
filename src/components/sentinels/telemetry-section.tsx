"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Gauge, Activity } from "lucide-react";

const telemetryRows = [
  { timestamp: "12:04:32.118 UTC", signal: "POS_X", value: "+24.551", signature: "0x7f3a...b2c1", verified: true },
  { timestamp: "12:04:32.119 UTC", signal: "POS_Y", value: "-12.003", signature: "0xa1e9...4d8f", verified: true },
  { timestamp: "12:04:32.120 UTC", signal: "VEL", value: "1.204", signature: "0x3c7b...e2a0", verified: true },
  { timestamp: "12:04:32.121 UTC", signal: "BATT", value: "87.2%", signature: "0xd4f1...8c3e", verified: true },
  { timestamp: "12:04:32.122 UTC", signal: "FIRMWARE", value: "v2.4.1", signature: "0x9a2e...f1b7", verified: true },
];

const metrics = [
  { icon: ShieldAlert, title: "Tamper Detection", description: "SHA-256 + Blake3 hash verification on every data point" },
  { icon: Gauge, title: "Trust Scoring", description: "Dynamic trust scores calculated from behavior patterns and attestation history" },
  { icon: Activity, title: "Anomaly Detection", description: "Statistical analysis flags unusual telemetry patterns in real-time" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.3 + i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function TelemetrySection() {
  return (
    <section id="telemetry" className="relative grid-bg-dense py-20 sm:py-28 lg:py-32 bg-surface border-t border-border">
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
            Trust Verification
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mt-3">
            Signed Telemetry Pipeline
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Every telemetry data point is cryptographically signed, timestamped, and verified. Tamper detection triggers immediate trust recalculation and fleet-wide alerts.
          </p>
        </motion.div>

        {/* Telemetry Dashboard */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="mb-12 sm:mb-16"
        >
          <div className="rounded-lg border border-border bg-white overflow-hidden shadow-sm">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-surface">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Telemetry
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[11px] text-muted-foreground">unit-0042</span>
                <span className="font-mono text-[11px] text-steel hidden sm:block">12:04:32 UTC</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface/50">
                    <th className="px-4 sm:px-6 py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Timestamp</th>
                    <th className="px-4 sm:px-6 py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Signal</th>
                    <th className="px-4 sm:px-6 py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Value</th>
                    <th className="px-4 sm:px-6 py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel hidden md:table-cell">Signature</th>
                    <th className="px-4 sm:px-6 py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {telemetryRows.map((row, i) => (
                    <motion.tr
                      key={i}
                      custom={i}
                      variants={rowVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="border-b border-border/50 last:border-0 hover:bg-surface/50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3 font-mono text-xs text-steel whitespace-nowrap">{row.timestamp}</td>
                      <td className="px-4 sm:px-6 py-3 font-mono text-xs font-semibold text-foreground whitespace-nowrap">{row.signal}</td>
                      <td className="px-4 sm:px-6 py-3 font-mono text-xs text-foreground whitespace-nowrap">{row.value}</td>
                      <td className="px-4 sm:px-6 py-3 font-mono text-xs text-steel hidden md:table-cell whitespace-nowrap">{row.signature}</td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        {row.verified ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            VERIFIED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-red-500 font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            FAILED
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="group rounded-md border border-border bg-white p-6 transition-colors duration-200 hover:border-sentinels/40 hover:shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-steel transition-colors group-hover:bg-sentinels/10 group-hover:text-sentinels">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground">{metric.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{metric.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
