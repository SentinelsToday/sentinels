"use client";

import { motion } from "framer-motion";
import {
  Monitor,
  MapPin,
  Activity,
  RefreshCw,
  AlertTriangle,
  Terminal,
  Wifi,
  Battery,
  Cpu,
  ShieldCheck,
} from "lucide-react";

const fleetRobots = [
  { id: "unit-0042", status: "active", battery: 87, task: "Warehouse A - Picking", trust: 94, latency: "12ms" },
  { id: "unit-0073", status: "active", battery: 62, task: "Bay 7 - Loading", trust: 98, latency: "8ms" },
  { id: "unit-0119", status: "idle", battery: 45, task: "Charging Station 3", trust: 91, latency: "15ms" },
  { id: "unit-0201", status: "active", battery: 93, task: "Warehouse B - Sort", trust: 99, latency: "6ms" },
  { id: "unit-0307", status: "alert", battery: 12, task: "Low Battery Warning", trust: 85, latency: "23ms" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export function FleetSection() {
  return (
    <section id="fleet" className="relative grid-bg py-20 sm:py-28 lg:py-32 bg-surface border-t border-border">
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
            Fleet Command
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mt-3">
            Real-Time Fleet Management
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Monitor robot health, deploy software updates, execute commands, and track missions â€” all from a single command center.
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="mb-12 sm:mb-16"
        >
          <div className="rounded-lg border border-border bg-white overflow-hidden shadow-sm">
            {/* Dashboard header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-surface">
              <div className="flex items-center gap-3">
                <Monitor className="h-4 w-4 text-sentinels" />
                <span className="font-mono text-sm font-semibold text-foreground">Fleet Dashboard</span>
                <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded">v2.4.1</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  4 online
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-amber-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  1 alert
                </span>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border">
              <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-r border-border">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-sentinels/10">
                  <Wifi className="h-4 w-4 text-sentinels" />
                </div>
                <div>
                  <p className="font-mono text-lg font-semibold text-foreground">247</p>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Connected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:border-r border-border">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500/10">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-mono text-lg font-semibold text-foreground">98.2%</p>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Fleet Trust</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-r border-border border-t sm:border-t-0">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-mono text-lg font-semibold text-foreground">1,847</p>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Missions Today</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-t sm:border-t-0">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-500/10">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-mono text-lg font-semibold text-foreground">3</p>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Alerts</p>
                </div>
              </div>
            </div>

            {/* Robot table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface/50">
                    <th className="px-4 sm:px-6 py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Robot ID</th>
                    <th className="px-4 sm:px-6 py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Status</th>
                    <th className="px-4 sm:px-6 py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Battery</th>
                    <th className="px-4 sm:px-6 py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel hidden sm:table-cell">Task</th>
                    <th className="px-4 sm:px-6 py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel">Trust</th>
                    <th className="px-4 sm:px-6 py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-widest text-steel hidden md:table-cell">Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {fleetRobots.map((robot) => (
                    <tr key={robot.id} className="border-b border-border/50 last:border-0 hover:bg-surface/50 transition-colors">
                      <td className="px-4 sm:px-6 py-3 font-mono text-xs font-semibold text-foreground">{robot.id}</td>
                      <td className="px-4 sm:px-6 py-3">
                        <span className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${
                          robot.status === "active" ? "text-emerald-600" :
                          robot.status === "idle" ? "text-steel" :
                          "text-amber-600"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            robot.status === "active" ? "bg-emerald-500" :
                            robot.status === "idle" ? "bg-gray-400" :
                            "bg-amber-500"
                          }`} />
                          {robot.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center gap-2">
                          <Battery className={`h-3.5 w-3.5 ${
                            robot.battery > 50 ? "text-emerald-500" :
                            robot.battery > 20 ? "text-amber-500" :
                            "text-red-500"
                          }`} />
                          <span className="font-mono text-xs text-foreground">{robot.battery}%</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">{robot.task}</td>
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-12 rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                robot.trust >= 95 ? "bg-emerald-500" :
                                robot.trust >= 85 ? "bg-amber-500" :
                                "bg-red-500"
                              }`}
                              style={{ width: `${robot.trust}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-foreground">{robot.trust}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{robot.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: MapPin, title: "Location Tracking", desc: "Real-time GPS and indoor positioning for every robot in your fleet" },
            { icon: RefreshCw, title: "OTA Updates", desc: "Deploy firmware and software updates with rollback protection" },
            { icon: Terminal, title: "Remote Commands", desc: "Execute verified commands with audit trail and permissions" },
            { icon: AlertTriangle, title: "Trust Alerts", desc: "Instant notifications when trust scores drop or anomalies detected" },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="group rounded-md border border-border bg-white p-5 transition-colors duration-200 hover:border-sentinels/40 hover:shadow-sm"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded bg-secondary text-steel transition-colors group-hover:bg-sentinels/10 group-hover:text-sentinels">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </div>
                <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground">{feature.title}</h3>
                <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
