import { db } from "@/lib/db";

export interface Pattern {
  type: string;
  confidence: number;
  description: string;
}

export interface AIAnalysis {
  riskScore: number;
  patterns: Pattern[];
  recommendation: string;
}

function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stddev(values: number[], avg: number): number {
  return Math.sqrt(values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length);
}

function zScore(value: number, avg: number, sd: number): number {
  return sd === 0 ? 0 : Math.abs((value - avg) / sd);
}

export async function analyzePattern(robotId: string): Promise<AIAnalysis> {
  const patterns: Pattern[] = [];

  const events = await db.telemetryEvent.findMany({
    where: { robotId },
    orderBy: { timestamp: "desc" },
    take: 50,
  });

  if (events.length >= 5) {
    const timestamps = (events as Record<string, unknown>[]).map((e) => new Date(e.timestamp as string).getTime());
    const intervals = timestamps.slice(0, -1).map((t, i) => t - timestamps[i + 1]);
    const avg = mean(intervals);
    const sd = stddev(intervals, avg);
    const latestInterval = intervals[0] || avg;
    const z = zScore(latestInterval, avg, sd);

    if (z > 2) {
      patterns.push({
        type: "frequency_anomaly",
        confidence: Math.min(z / 4, 1),
        description: `Telemetry frequency deviates ${z.toFixed(1)} std deviations from mean`,
      });
    }
  }

  const robot = (await db.robot.findUnique({ where: { id: robotId } })) as Record<string, unknown> | null;
  if (robot) {
    const logs = await db.auditLog.findMany({
      where: { robotId },
      orderBy: { timestamp: "desc" },
      take: 10,
    });
    const trustLogs = (logs as Record<string, unknown>[]).filter((l) => l.action === "trust_score_updated");
    const trustScore = robot.trustScore as number;
    if (trustLogs.length >= 3) {
      const scores = trustLogs.map((l) => {
        try { return JSON.parse(l.details as string)?.score ?? trustScore; } catch { return trustScore; }
      });
      const movingAvg = mean(scores);
      const deviation = Math.abs(trustScore - movingAvg);

      if (deviation > 15) {
        patterns.push({
          type: "trust_drift",
          confidence: Math.min(deviation / 40, 1),
          description: `Trust score shifted ${deviation.toFixed(0)} points from moving average`,
        });
      }
    }
  }

  const commands = await db.command.findMany({
    where: { robotId },
    orderBy: { timestamp: "desc" },
    take: 20,
  });
  if (commands.length >= 5) {
    const types = (commands as Record<string, unknown>[]).map((c) => c.type || c.action);
    const unique = new Set(types);
    const repetitionRatio = 1 - unique.size / types.length;

    if (repetitionRatio > 0.7) {
      patterns.push({
        type: "repetitive_commands",
        confidence: repetitionRatio,
        description: `Unusual command repetition detected (${(repetitionRatio * 100).toFixed(0)}% duplicate)`,
      });
    }
  }

  const riskScore = patterns.length === 0
    ? 0
    : Math.min(100, Math.round(patterns.reduce((sum, p) => sum + p.confidence * 40, 0)));

  const recommendation = riskScore > 60
    ? "Immediate review recommended — multiple anomalous patterns detected"
    : riskScore > 30
      ? "Monitor closely — mild anomalies present"
      : "No action needed — behavior within normal parameters";

  return { riskScore, patterns, recommendation };
}
