import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import nacl from "tweetnacl";
import bs58 from "bs58";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "API Key",
      credentials: {
        apiKey: { label: "API Key", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.apiKey) return null;
        const validKey = process.env.SENTINEL_ADMIN_KEY || "sentinel-admin-dev";
        if (credentials.apiKey === validKey) {
          return { id: "admin", name: "Fleet Admin", email: "admin@sentinel.dev" };
        }
        return null;
      },
    }),
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
          const publicKeyBytes = bs58.decode(credentials.publicKey);
          const signatureBytes = Uint8Array.from(atob(credentials.signature), (c) => c.charCodeAt(0));
          const messageBytes = new TextEncoder().encode(credentials.message);

          const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
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
