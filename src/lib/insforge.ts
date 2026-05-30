import { createClient } from "@insforge/sdk";

export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || "https://y3k36z2p.us-east.insforge.app",
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || "",
});
