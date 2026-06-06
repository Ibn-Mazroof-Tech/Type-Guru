import { NextRequest, NextResponse } from "next/server";
import { db, leaderboard, users } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const mode  = req.nextUrl.searchParams.get("mode") ?? "general";
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "20"), 50);

  const rows = await db
    .select({
      userId: leaderboard.userId, bestWpm: leaderboard.bestWpm,
      bestAccuracy: leaderboard.bestAccuracy, streakDays: leaderboard.streakDays,
      mode: leaderboard.mode, userName: users.name, userImage: users.image,
    })
    .from(leaderboard)
    .innerJoin(users, eq(leaderboard.userId, users.id))
    .where(mode !== "all" ? eq(leaderboard.mode, mode) : undefined)
    .orderBy(desc(leaderboard.bestWpm))
    .limit(limit);

  return NextResponse.json({ leaderboard: rows.map((r, i) => ({ ...r, rank: i + 1 })) });
}
