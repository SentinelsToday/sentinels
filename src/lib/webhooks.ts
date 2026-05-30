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

export async function dispatchWebhook(event: string, payload: any, fleetId: string): Promise<void> {
  const webhooks = await db.webhook.findMany({
    where: { fleetId, active: true },
  });

  const matched = webhooks.filter((w: { events: string }) => {
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
      const res = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Sentinel-Event": event,
          "X-Sentinel-Signature": signature,
          "X-Sentinel-Timestamp": timestamp,
        },
        body,
      });
      console.log(`[webhook] ${event} -> ${webhook.url} : ${res.status}`);
    } catch (err) {
      console.error(`[webhook] ${event} -> ${webhook.url} failed:`, err);
    }
  }
}
