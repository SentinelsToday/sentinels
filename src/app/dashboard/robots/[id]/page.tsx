"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Send } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

export default function RobotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: robot, isLoading } = useQuery({
    queryKey: ["robot", id],
    queryFn: () => fetch(`/api/robots/${id}`).then((r) => r.json()),
  });

  const { data: trustData } = useQuery({
    queryKey: ["trust", id],
    queryFn: () => fetch(`/api/verify/trust/${id}`).then((r) => r.json()),
  });

  const { data: commands } = useQuery({
    queryKey: ["commands", id],
    queryFn: () => fetch(`/api/robots/${id}/command`).then((r) => r.json()),
  });

  const { data: auditData } = useQuery({
    queryKey: ["audit", id],
    queryFn: () => fetch(`/api/audit?robotId=${id}&limit=20`).then((r) => r.json()),
  });

  const commandMutation = useMutation({
    mutationFn: (body: { type: string; payload?: string }) =>
      fetch(`/api/robots/${id}/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commands", id] });
      queryClient.invalidateQueries({ queryKey: ["audit", id] });
    },
  });

  const [cmdType, setCmdType] = useState("STATUS_CHECK");
  const [cmdPayload, setCmdPayload] = useState("");

  if (isLoading) {
    return <p className="text-neutral-400">Loading…</p>;
  }

  if (!robot || robot.error) {
    return <p className="text-red-500">Robot not found.</p>;
  }

  const trustScore = trustData?.trustScore ?? robot.trustScore ?? 0;
  const chartData = [{ value: Number(trustScore), fill: trustScore >= 70 ? "#10b981" : trustScore >= 40 ? "#f59e0b" : "#ef4444" }];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/robots">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-[#111113]">{robot.name}</h1>
        <StatusBadge status={robot.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identity Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-mono uppercase text-neutral-500">
              Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="DID" value={robot.did} mono />
            <InfoRow label="Model" value={robot.model || "—"} />
            <InfoRow label="Serial" value={robot.serialNumber} mono />
            <InfoRow label="Fleet ID" value={robot.fleetId || "—"} mono />
            {robot.publicKey && (
              <InfoRow label="Public Key" value={robot.publicKey} mono truncate />
            )}
            {robot.fingerprint && (
              <InfoRow label="Fingerprint" value={robot.fingerprint} mono />
            )}
          </CardContent>
        </Card>

        {/* Trust Score */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-mono uppercase text-neutral-500">
              Trust Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-32 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="70%"
                  outerRadius="100%"
                  data={chartData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={4}
                    background={{ fill: "#f5f5f5" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-3xl font-bold text-[#111113] -mt-4">
              {Number(trustScore).toFixed(0)}%
            </p>
            {trustData?.factors && (
              <div className="mt-3 w-full space-y-1">
                {Object.entries(trustData.factors).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-neutral-500 font-mono">{key}</span>
                    <span className="text-[#111113]">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="firmware">
        <TabsList>
          <TabsTrigger value="firmware">Firmware</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="firmware">
          <Card>
            <CardContent className="pt-6">
              {robot.firmwareRecords?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {robot.firmwareRecords.map((fw: any) => (
                      <TableRow key={fw.id}>
                        <TableCell className="font-mono text-xs">
                          {fw.version}
                        </TableCell>
                        <TableCell>
                          <Badge variant={fw.status === "VERIFIED" ? "default" : "outline"} className="text-[10px] font-mono">
                            {fw.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-neutral-400 text-xs">
                          {new Date(fw.verifiedAt || fw.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-neutral-400 py-4">No firmware records.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commands">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  commandMutation.mutate({
                    type: cmdType,
                    payload: cmdPayload || undefined,
                  });
                  setCmdPayload("");
                }}
                className="flex gap-2 items-end"
              >
                <div className="space-y-1">
                  <Label className="text-xs">Command Type</Label>
                  <Select value={cmdType} onValueChange={setCmdType}>
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STATUS_CHECK">STATUS_CHECK</SelectItem>
                      <SelectItem value="REBOOT">REBOOT</SelectItem>
                      <SelectItem value="UPDATE_FIRMWARE">UPDATE_FIRMWARE</SelectItem>
                      <SelectItem value="EMERGENCY_STOP">EMERGENCY_STOP</SelectItem>
                      <SelectItem value="CUSTOM">CUSTOM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Payload (optional)</Label>
                  <Input
                    value={cmdPayload}
                    onChange={(e) => setCmdPayload(e.target.value)}
                    placeholder="JSON payload…"
                    className="font-mono text-xs"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#E8553D] hover:bg-[#d14a34] text-white"
                  disabled={commandMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </form>

              {commands?.commands?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commands.commands.map((cmd: any) => (
                      <TableRow key={cmd.id}>
                        <TableCell className="font-mono text-xs">{cmd.type}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {cmd.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-neutral-400 text-xs">
                          {new Date(cmd.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-neutral-400">No commands sent yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardContent className="pt-6">
              {auditData?.logs?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditData.logs.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">{log.action}</TableCell>
                        <TableCell className="text-neutral-500 text-xs max-w-xs truncate">
                          {log.details ? JSON.stringify(log.details).slice(0, 80) : "—"}
                        </TableCell>
                        <TableCell className="text-neutral-400 text-xs">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-neutral-400 py-4">No audit logs.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
  truncate,
}: {
  label: string;
  value: string;
  mono?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs text-neutral-500 w-24 shrink-0 font-mono uppercase">
        {label}
      </span>
      <span
        className={`text-sm text-[#111113] ${mono ? "font-mono" : ""} ${
          truncate ? "truncate max-w-md" : ""
        } break-all`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
    OFFLINE: "bg-neutral-100 text-neutral-500 border-neutral-200",
    COMPROMISED: "bg-red-100 text-red-700 border-red-200",
    MAINTENANCE: "bg-amber-100 text-amber-700 border-amber-200",
  };
  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-mono ${variants[status] || ""}`}
    >
      {status}
    </Badge>
  );
}
