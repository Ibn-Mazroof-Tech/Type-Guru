// auth.config.ts — Edge-safe NextAuth config (used by middleware only)
// ⚠️  DO NOT import bcrypt, DrizzleAdapter, or db here — this runs in Edge Runtime.

import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Note: Credentials provider intentionally omitted here.
    // It needs bcryptjs (Node.js-only) so it lives only in lib/auth/config.ts.
  ],
  pages: {
    signIn:  "/login",
    signOut: "/",
    error:   "/login",
  },
} satisfies NextAuthConfig;
