"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Bot, Activity, WifiOff, AlertTriangle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubscriptionCard } from "@/components/dashboard/subscription-card";

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["fleet-stats"],
    queryFn: () => fetchJson("/api/fleet/stats"),
  });

  const { data: robotsData, isLoading: robotsLoading, error: robotsError } = useQuery({
    queryKey: ["robots"],
    queryFn: () => fetchJson("/api/robots/register"),
  });

  const statCards = [
    { label: "Total Robots", value: stats?.totalRobots ?? "—", icon: Bot },
    { label: "Active", value: stats?.activeRobots ?? "—", icon: Activity },
    { label: "Offline", value: stats?.offlineRobots ?? "—", icon: WifiOff },
    {
      label: "Compromised",
      value: stats?.compromisedRobots ?? "—",
      icon: AlertTriangle,
    },
  ];

  const robots = Array.isArray(robotsData?.robots) ? robotsData.robots : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#111113]">
          Fleet Overview
        </h1>
        <Link href="/dashboard/robots">
          <Button size="sm" className="bg-[#E8553D] hover:bg-[#d14a34] text-white">
            <Plus className="h-4 w-4 mr-1" />
            Register Robot
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="py-4">
            <CardContent className="px-4 py-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-500 font-mono uppercase">
                    {s.label}
                  </p>
                  <p className="text-2xl font-semibold text-[#111113] mt-1">
                    {statsLoading ? "…" : statsError ? "—" : s.value}
                  </p>
                </div>
                <s.icon className="h-5 w-5 text-neutral-400" />
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="py-4">
          <CardContent className="px-4 py-0">
            <div>
              <p className="text-xs text-neutral-500 font-mono uppercase">
                Avg Trust Score
              </p>
              <p className="text-2xl font-semibold text-[#111113] mt-1">
                {statsLoading
                  ? "…"
                  : statsError
                  ? "—"
                  : stats?.averageTrustScore != null
                  ? `${Number(stats.averageTrustScore).toFixed(0)}%`
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <SubscriptionCard />

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-mono uppercase text-neutral-500">
            Recent Robots
          </CardTitle>
        </CardHeader>
        <CardContent>
          {robotsLoading ? (
            <p className="text-sm text-neutral-400 py-4">Loading…</p>
          ) : robotsError ? (
            <p className="text-sm text-red-400 py-4">Failed to load robots</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trust</TableHead>
                  <TableHead>Serial</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {robots.slice(0, 10).map((robot: { id: string; name: string; model?: string; status: string; trustScore?: number; serialNumber: string }) => (
                  <TableRow key={robot.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/robots/${robot.id}`}
                        className="text-[#111113] hover:text-[#E8553D] font-medium"
                      >
                        {robot.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-neutral-500 font-mono text-xs">
                      {robot.model || "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={robot.status} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {robot.trustScore != null
                        ? `${Number(robot.trustScore).toFixed(0)}%`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-neutral-400 font-mono text-xs">
                      {robot.serialNumber}
                    </TableCell>
                  </TableRow>
                ))}
                {robots.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-neutral-400 py-8">
                      No robots registered yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
