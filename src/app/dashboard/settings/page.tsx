"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ApiKey {
  id: string;
  name: string;
  maskedKey: string;
  createdAt: string;
}

async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function SettingsPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchJson("/api/keys");
      setKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load keys");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const generateKey = async () => {
    if (!keys.length) return;
    try {
      const data = await fetchJson("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fleetId: keys[0].id }),
      });
      setNewKey(data.apiKey);
      fetchKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate key");
    }
  };

  const revokeKey = async (id: string) => {
    try {
      await fetchJson(`/api/keys/${id}`, { method: "DELETE" });
      setNewKey(null);
      fetchKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke key");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight">API Key Management</h1>

      {error && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="pt-4">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {newKey && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-1">New API key (copy now — shown only once):</p>
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded break-all">{newKey}</code>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Active Keys</CardTitle>
          <Button size="sm" onClick={generateKey} disabled={!keys.length}>
            Generate Key
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : keys.length === 0 ? (
            <p className="text-sm text-muted-foreground">No API keys found. Create a fleet first.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fleet</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.name}</TableCell>
                    <TableCell className="font-mono text-xs">{k.maskedKey}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell><Badge variant="secondary">Active</Badge></TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => revokeKey(k.id)}>
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
