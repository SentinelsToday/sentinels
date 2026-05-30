"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function RobotsPage() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["robots"],
    queryFn: () => fetch("/api/robots/register").then((r) => r.json()),
  });

  const registerMutation = useMutation({
    mutationFn: (body: { name: string; serialNumber: string; model?: string }) =>
      fetch("/api/robots/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["robots"] });
      queryClient.invalidateQueries({ queryKey: ["fleet-stats"] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    registerMutation.mutate({
      name: fd.get("name") as string,
      serialNumber: fd.get("serialNumber") as string,
      model: (fd.get("model") as string) || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#111113]">Robots</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#E8553D] hover:bg-[#d14a34] text-white">
              <Plus className="h-4 w-4 mr-1" />
              Register Robot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Robot</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="e.g. Patrol Unit Alpha" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input id="serialNumber" name="serialNumber" required placeholder="e.g. SN-001-XR" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model (optional)</Label>
                <Input id="model" name="model" placeholder="e.g. Guardian X1" />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#E8553D] hover:bg-[#d14a34] text-white"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Registering…" : "Register"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-mono uppercase text-neutral-500">
            All Robots ({data?.count ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-neutral-400 py-4">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Serial</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trust Score</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.robots?.map((robot: any) => (
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
                    <TableCell className="font-mono text-xs text-neutral-400">
                      {robot.serialNumber}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={robot.status} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {robot.trustScore != null
                        ? `${Number(robot.trustScore).toFixed(0)}%`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-neutral-400 text-xs">
                      {new Date(robot.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {(!data?.robots || data.robots.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-neutral-400 py-8">
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
