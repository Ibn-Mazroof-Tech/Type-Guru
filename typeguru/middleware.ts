import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES    = ["/", "/login", "/signup", "/pricing"];
const PRO_ONLY_ROUTES  = ["/coach", "/certificates"];
const PRO_ONLY_MODES   = ["coding", "arabic"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session      = req.auth;

  // Allow public routes always
  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();

  // Require login for all dashboard routes
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Require Pro plan for coach and certificates
  const isPro = ["pro", "pro_monthly", "pro_yearly", "daypass"].includes(
    session.user?.plan ?? "free"
  );

  if (PRO_ONLY_ROUTES.some((r) => pathname.startsWith(r)) && !isPro) {
    return NextResponse.redirect(new URL("/pricing?upgrade=true", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
