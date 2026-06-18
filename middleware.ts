// middleware.ts — Runs in Edge Runtime on Vercel.
// Imports ONLY from auth.config.ts (Edge-safe). Never import from lib/auth/config.ts here.

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Routes accessible without a session
const PUBLIC_ROUTES = ["/", "/login", "/signup", "/pricing"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session      = req.auth;

  // Always allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();

  // Redirect unauthenticated users to login
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ℹ️  Pro-only route checks (e.g. /coach) are handled by the server components
  // themselves via auth() + isPro(). The middleware only verifies that the user
  // is *logged in*, not what plan they hold — the plan in the JWT cookie may be
  // stale between payments, so the server component does a fresh DB check.

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
