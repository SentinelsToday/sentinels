export const PLANS = {
  starter: { price: 29, robotLimit: 10 },
  fleet: { price: 99, robotLimit: 100 },
  enterprise: { price: null, robotLimit: -1 },
} as const;

export type PlanKey = keyof typeof PLANS;

export async function getStripe(): Promise<any | null> {
  // Stripe SDK not installed — returns null (mock mode)
  // Install `stripe` package and set STRIPE_SECRET_KEY to enable
  return null;
}
