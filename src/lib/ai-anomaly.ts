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

  // Fetch recent telemetry
  const events = await db.telemetryEvent.findMany({
    where: { robotId },
    orderBy: { timestamp: "desc" },
    take: 50,
  });

  // 1. Z-score on telemetry frequency
  if (events.length >= 5) {
    const timestamps = events.map((e: any) => new Date(e.timestamp).getTime());
    const intervals = timestamps.slice(0, -1).map((t: number, i: number) => t - timestamps[i + 1]);
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

  // 2. Moving average on trust score
  const robot = await db.robot.findUnique({ where: { id: robotId } });
  if (robot) {
    const logs = await db.auditLog.findMany({
      where: { robotId },
      orderBy: { timestamp: "desc" },
      take: 10,
    });
    const trustLogs = logs.filter((l: any) => l.action === "trust_score_updated");
    if (trustLogs.length >= 3) {
      const scores = trustLogs.map((l: any) => {
        try { return JSON.parse(l.details)?.score ?? robot.trustScore; } catch { return robot.trustScore; }
      });
      const movingAvg = mean(scores);
      const currentScore = robot.trustScore ?? 100;
      const deviation = Math.abs(currentScore - movingAvg);

      if (deviation > 15) {
        patterns.push({
          type: "trust_drift",
          confidence: Math.min(deviation / 40, 1),
          description: `Trust score shifted ${deviation.toFixed(0)} points from moving average`,
        });
      }
    }
  }

  // 3. Pattern matching on command sequences
  const commands = await db.command.findMany({
    where: { robotId },
    orderBy: { timestamp: "desc" },
    take: 20,
  });
  if (commands.length >= 5) {
    const types = commands.map((c: any) => c.type || c.action);
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

  // Compute risk score (0-100)
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
