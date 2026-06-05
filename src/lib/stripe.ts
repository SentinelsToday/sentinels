export const PLANS = {
  starter: { price: 29, robotLimit: 10 },
  fleet: { price: 99, robotLimit: 100 },
  enterprise: { price: null, robotLimit: -1 },
} as const;

export type PlanKey = keyof typeof PLANS;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StripeInstance = any;

export async function getStripe(): Promise<StripeInstance | null> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Stripe = require("stripe");
    return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-03-31" as const });
  } catch {
    return null;
  }
}
