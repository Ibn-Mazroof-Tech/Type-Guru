// lib/auth/config.ts — Full NextAuth config for server components and API routes.
// Runs in Node.js runtime only. NEVER import this from middleware.ts.

import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, users, accounts, sessions, verificationTokens } from "@/lib/db";
import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  // Explicit table mapping avoids DrizzleAdapter schema-discovery edge cases
  adapter: DrizzleAdapter(db, {
    usersTable:              users,
    accountsTable:           accounts,
    sessionsTable:           sessions,
    verificationTokensTable: verificationTokens,
  }),

  session: { strategy: "jwt" },

  providers: [
    // Google comes from authConfig (Edge-safe). Re-exported here for the full server build.
    ...authConfig.providers,

    // Credentials provider — needs bcrypt, so it lives here only.
    Credentials({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      // On first sign-in: persist user id + fetch plan from DB once
      if (user) {
        token.id = user.id;
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id as string),
        });
        token.plan = dbUser?.plan ?? "free";
      }

      // On explicit update() call from the client (e.g. after payment)
      if (trigger === "update" && token.id) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, token.id as string),
        });
        if (dbUser) token.plan = dbUser.plan;
      }

      // ℹ️  Intentionally no unconditional DB query here.
      // Previously every auth() call hit the DB (slow). Now the plan is cached
      // in the JWT and refreshed on sign-in or when the client calls update().

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id   as string;
        session.user.plan = (token.plan as string) ?? "free";
      }
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id:     string;
      plan:   string;
      name?:  string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
