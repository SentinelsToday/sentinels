export type TelemetryRow = { robotId: string; eventType: string; payload: any; timestamp: string };
export type Aggregate = { bucket: string; count: number; avgValue?: number };

const store: TelemetryRow[] = [];

export async function insertTelemetry(event: TelemetryRow): Promise<void> {
  store.push(event);
}

export async function queryTelemetry(params: { robotId?: string; eventType?: string; from?: string; to?: string; limit?: number }): Promise<TelemetryRow[]> {
  let results = store.filter((e) => {
    if (params.robotId && e.robotId !== params.robotId) return false;
    if (params.eventType && e.eventType !== params.eventType) return false;
    if (params.from && e.timestamp < params.from) return false;
    if (params.to && e.timestamp > params.to) return false;
    return true;
  });
  return results.slice(0, params.limit ?? 100);
}

export async function getAggregates(robotId: string, interval: '1m' | '5m' | '1h' | '1d'): Promise<Aggregate[]> {
  const ms = { '1m': 60000, '5m': 300000, '1h': 3600000, '1d': 86400000 }[interval];
  const buckets = new Map<string, number>();
  for (const e of store) {
    if (e.robotId !== robotId) continue;
    const t = Math.floor(new Date(e.timestamp).getTime() / ms) * ms;
    const key = new Date(t).toISOString();
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets, ([bucket, count]) => ({ bucket, count }));
}

export function getTelemetryStats(): { totalEvents: number; uniqueRobots: number; eventsPerMinute: number } {
  const uniqueRobots = new Set(store.map((e) => e.robotId)).size;
  const now = Date.now();
  const oneMinAgo = now - 60000;
  const eventsPerMinute = store.filter((e) => new Date(e.timestamp).getTime() > oneMinAgo).length;
  return { totalEvents: store.length, uniqueRobots, eventsPerMinute };
}
