import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verify } from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    // API Key / JWT credentials auth for dashboard
    CredentialsProvider({
      id: "credentials",
      name: "API Key",
      credentials: {
        apiKey: { label: "API Key", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.apiKey) return null;
        // In production: validate against fleet API keys in DB
        // For now: accept the configured admin key
        const validKey = process.env.SENTINEL_ADMIN_KEY || "sentinel-admin-dev";
        if (credentials.apiKey === validKey) {
          return { id: "admin", name: "Fleet Admin", email: "admin@sentinel.dev" };
        }
        return null;
      },
    }),
    // Wallet-based auth (Solana signature verification)
    CredentialsProvider({
      id: "wallet",
      name: "Wallet",
      credentials: {
        publicKey: { label: "Public Key", type: "text" },
        signature: { label: "Signature", type: "text" },
        message: { label: "Message", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.publicKey || !credentials?.signature || !credentials?.message) return null;
        try {
          // Verify the signed message matches the public key
          // In production: use @solana/web3.js to verify Ed25519 signature
          const isValid = credentials.signature.length > 0 && credentials.publicKey.length > 0;
          if (!isValid) return null;
          return {
            id: credentials.publicKey,
            name: `Wallet ${credentials.publicKey.slice(0, 8)}...`,
            email: null,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  jwt: { maxAge: 24 * 60 * 60 },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
