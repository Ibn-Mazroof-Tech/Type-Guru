import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { typingTests, leaderboard, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  wpm:      z.number().int().min(1).max(300),
  accuracy: z.number().int().min(0).max(100),
  errors:   z.number().int().min(0),
  mode:     z.enum(["general","government","data","coding","arabic","race","falling","word-builder"]),
  duration: z.number().int().default(60),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data." }, { status: 400 });

  const { wpm, accuracy, errors, mode, duration } = parsed.data;
  const userId = session.user.id;

  await db.insert(typingTests).values({ userId, wpm, accuracy, errors, mode, duration });

  const existing = await db.query.leaderboard.findFirst({
    where: and(eq(leaderboard.userId, userId), eq(leaderboard.mode, mode)),
  });

  if (!existing || wpm > existing.bestWpm) {
    await db.insert(leaderboard)
      .values({ userId, mode, bestWpm: wpm, bestAccuracy: accuracy })
      .onConflictDoUpdate({
        target: [leaderboard.userId, leaderboard.mode],
        set:    { bestWpm: wpm, bestAccuracy: accuracy, updatedAt: new Date() },
      });
  }

  await db.update(users).set({ lastActiveAt: new Date() }).where(eq(users.id, userId));
  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tests = await db.query.typingTests.findMany({
    where:   eq(typingTests.userId, session.user.id),
    orderBy: (t, { desc }) => [desc(t.completedAt)],
    limit:   20,
  });
  return NextResponse.json({ tests });
}
