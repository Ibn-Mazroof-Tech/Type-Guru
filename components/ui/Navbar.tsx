"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",             label: "🏠 Home"      },
  { href: "/practice",     label: "⌨️ Practice"   },
  { href: "/coach",        label: "🤖 AI Coach"   },
  { href: "/leaderboard",  label: "🏆 Ranks"      },
  { href: "/pricing",      label: "💎 Pricing"    },
];

export function Navbar() {
  const pathname         = usePathname();
  const { data: session} = useSession();
  const [open, setOpen]  = useState(false);
  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-bg-primary/97 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link href="/" className="font-brand text-brand-cyan font-black text-base tracking-widest shrink-0 hover:opacity-90 transition-opacity">
          TYPE<span className="text-brand-gold">GURU</span>
          <span className="text-[8px] text-text-muted font-sans font-normal tracking-normal ml-1.5">BETA</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-1 overflow-x-auto">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                isActivePath(l.href)
                  ? "bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan font-bold"
                  : "text-text-muted hover:text-text-primary border border-transparent"
              )}>
              {l.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-border text-text-muted hover:text-text-primary transition-all">
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-1.5">
            <span className="block h-[2px] w-5 bg-current" />
            <span className="block h-[2px] w-5 bg-current" />
            <span className="block h-[2px] w-5 bg-current" />
          </div>
        </button>

        {/* Auth Buttons */}
        <div className="flex gap-2 shrink-0 items-center">
          {session ? (
            <div className="flex items-center gap-2">
              <span className={cn(
                "tag text-[10px]",
                session.user.plan === "free"
                  ? "bg-text-muted/10 border-text-muted/30 text-text-muted"
                  : "bg-brand-gold/15 border-brand-gold/35 text-brand-gold"
              )}>
                {session.user.plan === "free" ? "FREE" : "PRO"}
              </span>
              <button onClick={() => signOut()}
                className="text-xs text-text-muted border border-border px-3 py-1.5 rounded-lg hover:text-text-primary transition-all">
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login"
                className="hidden sm:block text-xs text-text-muted border border-border px-3 py-1.5 rounded-lg hover:text-text-primary transition-all">
                Log In
              </Link>
              <Link href="/signup"
                className="text-xs bg-gradient-to-r from-brand-cyan to-blue-500 text-black font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-all">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-bg-secondary border-t border-border">
          <div className="max-w-6xl mx-auto px-5 py-3 space-y-2">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  isActivePath(l.href)
                    ? "bg-brand-cyan/10 text-brand-cyan"
                    : "text-text-muted hover:text-text-primary"
                )}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
