import { createHmac } from "crypto";
import { db } from "@/lib/db";

export const WEBHOOK_EVENTS = [
  "robot.registered",
  "robot.offline",
  "anomaly.detected",
  "firmware.verified",
  "trust.changed",
  "command.executed",
] as const;

export async function dispatchWebhook(event: string, payload: unknown, fleetId: string): Promise<void> {
  const webhooks = (await db.webhook.findMany({
    where: { fleetId, active: true },
  })) as { events: string; secret: string; url: string }[];

  const matched = webhooks.filter((w) => {
    const events: string[] = JSON.parse(w.events);
    return events.includes(event);
  });

  const timestamp = Date.now().toString();

  for (const webhook of matched) {
    const body = JSON.stringify(payload);
    const signature = createHmac("sha256", webhook.secret)
      .update(`${timestamp}.${body}`)
      .digest("hex");

    try {
      await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Sentinels-Event": event,
          "X-Sentinels-Signature": signature,
          "X-Sentinels-Timestamp": timestamp,
        },
        body,
      });
    } catch {
      console.warn(`[warn] Webhook dispatch failed: ${event} -> ${webhook.url}`);
    }
  }
}
