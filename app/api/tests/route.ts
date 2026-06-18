import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { typingTests, leaderboard, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const schema = z.object({
  wpm:      z.number().int().min(1).max(300),
  accuracy: z.number().int().min(0).max(100),
  errors:   z.number().int().min(0),
  mode:     z.enum(["general","government","data","coding","arabic","race","falling","word-builder"]),
  duration: z.number().int().default(60),
});

// Lazy-initialised so missing env vars in local dev don't hard-crash the server
let freeLimiter: Ratelimit | null = null;

function getRateLimiter(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null; // gracefully skip rate limiting if Redis is not configured
  }
  if (!freeLimiter) {
    freeLimiter = new Ratelimit({
      redis: new Redis({
        url:   process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      }),
      limiter: Ratelimit.slidingWindow(5, "24 h"), // 5 tests per 24 hours for free users
      prefix:  "rl:tests:free",
    });
  }
  return freeLimiter;
}

// Returns true when `date` falls on the calendar day before today (UTC)
function isYesterday(date: Date | null): boolean {
  if (!date) return false;
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return (
    date.getUTCFullYear() === yesterday.getUTCFullYear() &&
    date.getUTCMonth()    === yesterday.getUTCMonth()    &&
    date.getUTCDate()     === yesterday.getUTCDate()
  );
}

// Returns true when `date` falls on today (UTC)
function isToday(date: Date | null): boolean {
  if (!date) return false;
  const now = new Date();
  return (
    date.getUTCFullYear() === now.getUTCFullYear() &&
    date.getUTCMonth()    === now.getUTCMonth()    &&
    date.getUTCDate()     === now.getUTCDate()
  );
}

// ─── POST /api/tests ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data." }, { status: 400 });
  }

  const { wpm, accuracy, errors, mode, duration } = parsed.data;
  const userId  = session.user.id;
  const userPlan = session.user.plan ?? "free";

  // ── Rate limit free-tier users (5 tests / 24 h) ────────────────────────────
  if (userPlan === "free") {
    const limiter = getRateLimiter();
    if (limiter) {
      const { success, remaining } = await limiter.limit(userId);
      if (!success) {
        return NextResponse.json(
          {
            error: "Free plan limit reached — 5 tests per day. Upgrade to Pro for unlimited practice.",
            remaining: 0,
            upgradeUrl: "/pricing",
          },
          { status: 429 }
        );
      }
    }
  }

  // ── Insert test result ──────────────────────────────────────────────────────
  await db.insert(typingTests).values({ userId, wpm, accuracy, errors, mode, duration });

  // ── Streak calculation ──────────────────────────────────────────────────────
  const currentUser = await db.query.users.findFirst({ where: eq(users.id, userId) });
  const lastActive  = currentUser?.lastActiveAt ?? null;

  let newStreak: number;
  if (isToday(lastActive)) {
    // Already active today — keep the current streak count
    newStreak = currentUser?.streakDays ?? 1;
  } else if (isYesterday(lastActive)) {
    // Practiced yesterday — extend the streak
    newStreak = (currentUser?.streakDays ?? 0) + 1;
  } else {
    // Gap of 1+ days — streak resets to 1
    newStreak = 1;
  }

  await db
    .update(users)
    .set({ lastActiveAt: new Date(), streakDays: newStreak })
    .where(eq(users.id, userId));

  // ── Leaderboard upsert ──────────────────────────────────────────────────────
  const existing = await db.query.leaderboard.findFirst({
    where: and(eq(leaderboard.userId, userId), eq(leaderboard.mode, mode)),
  });

  if (!existing) {
    // First entry for this user + mode
    await db
      .insert(leaderboard)
      .values({ userId, mode, bestWpm: wpm, bestAccuracy: accuracy, streakDays: newStreak })
      .onConflictDoUpdate({
        target: [leaderboard.userId, leaderboard.mode],
        set:    { bestWpm: wpm, bestAccuracy: accuracy, streakDays: newStreak, updatedAt: new Date() },
      });
  } else {
    // Always update streak; only update WPM when it's a new personal best
    await db
      .update(leaderboard)
      .set({
        ...(wpm > existing.bestWpm ? { bestWpm: wpm, bestAccuracy: accuracy } : {}),
        streakDays: newStreak,
        updatedAt:  new Date(),
      })
      .where(and(eq(leaderboard.userId, userId), eq(leaderboard.mode, mode)));
  }

  return NextResponse.json({ success: true, streak: newStreak });
}

// ─── GET /api/tests ─────────────────────────────────────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tests = await db.query.typingTests.findMany({
    where:   eq(typingTests.userId, session.user.id),
    orderBy: (t, { desc }) => [desc(t.completedAt)],
    limit:   20,
  });

  return NextResponse.json({ tests });
}
