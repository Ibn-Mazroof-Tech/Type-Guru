import { Metadata } from "next";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { leaderboard, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";

export const metadata: Metadata = { title: "Leaderboard — TypeGuru" };

const MEDALS = ["🥇", "🥈", "🥉"];
const MOCK_LEADERS = [
  { rank:1, name:"Rahul Sharma",  wpm:142, acc:99.2, loc:"Delhi",      mode:"Govt Exam",  streak:48 },
  { rank:2, name:"Priya Nair",    wpm:138, acc:98.8, loc:"Kerala",     mode:"General",    streak:31 },
  { rank:3, name:"Ahmed Khan",    wpm:131, acc:99.5, loc:"Hyderabad",  mode:"Arabic",     streak:62 },
  { rank:4, name:"Sneha Patel",   wpm:127, acc:97.9, loc:"Ahmedabad",  mode:"Data Entry", streak:15 },
  { rank:5, name:"Vikram Singh",  wpm:122, acc:98.1, loc:"Chandigarh", mode:"Govt Exam",  streak:27 },
  { rank:6, name:"Fatima Shaikh", wpm:119, acc:99.0, loc:"Mumbai",     mode:"Arabic",     streak:44 },
  { rank:7, name:"Arjun Menon",   wpm:115, acc:97.5, loc:"Chennai",    mode:"Coding",     streak:19 },
  { rank:8, name:"Deepak Rao",    wpm:112, acc:97.1, loc:"Bangalore",  mode:"General",    streak:8  },
];

export default async function LeaderboardPage() {
  const session = await auth();

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">🏆 National Leaderboard</h1>
        <p className="text-text-muted text-sm">Top typists across India · Updated every 24 hours</p>
      </div>

      <div className="card overflow-hidden mb-4">
        {/* Header */}
        <div className="grid grid-cols-[52px_1fr_60px_60px_80px_64px] px-4 py-2.5 border-b border-border
          text-[9px] text-text-muted uppercase tracking-widest">
          <div>Rank</div><div>Typist</div>
          <div className="text-center">WPM</div>
          <div className="text-center">Acc%</div>
          <div className="text-center">Mode</div>
          <div className="text-center">Streak</div>
        </div>

        {MOCK_LEADERS.map((l, i) => (
          <div key={l.rank}
            className="grid grid-cols-[52px_1fr_60px_60px_80px_64px] px-4 py-3 transition-colors hover:bg-brand-cyan/[0.04]"
            style={{
              borderBottom: i < MOCK_LEADERS.length - 1 ? "1px solid rgba(0,229,255,0.11)" : "none",
              background: i < 3
                ? `linear-gradient(to right, ${["rgba(255,184,0,0.04)","rgba(192,192,192,0.03)","rgba(205,127,50,0.03)"][i]}, transparent)`
                : "transparent",
            }}>
            <div className="text-lg self-center">{MEDALS[i] ?? `#${l.rank}`}</div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-cyan/15 border border-brand-cyan/25
                flex items-center justify-center font-mono font-bold text-[10px] text-brand-cyan shrink-0">
                {l.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="font-semibold text-sm">{l.name}</div>
                <div className="text-text-muted text-[10.5px]">📍 {l.loc}</div>
              </div>
            </div>
            <div className="font-mono font-bold text-brand-cyan text-center self-center text-sm">{l.wpm}</div>
            <div className="font-mono text-brand-green text-center self-center text-xs">{l.acc}%</div>
            <div className="text-center self-center">
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-brand-blue/15 border border-brand-blue/30 text-brand-blue">
                {l.mode}
              </span>
            </div>
            <div className="text-center self-center text-xs text-brand-gold">🔥 {l.streak}d</div>
          </div>
        ))}
      </div>

      {/* Your rank */}
      <div className="card p-4 border-brand-cyan/20 bg-brand-cyan/[0.04] flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-cyan/15 border border-brand-cyan/30
            flex items-center justify-center text-lg">👤</div>
          <div>
            <div className="font-bold text-sm">{session?.user?.name ?? "Your Rank"}</div>
            <div className="text-text-muted text-xs">
              {session ? "Keep practicing to climb the board!" : "Sign up to appear on the leaderboard"}
            </div>
          </div>
        </div>
        {!session ? (
          <Link href="/signup" className="btn-primary text-xs px-4 py-2">Join Leaderboard →</Link>
        ) : (
          <Link href="/practice" className="btn-outline text-xs px-4 py-2">Practice Now →</Link>
        )}
      </div>
    </div>
  );
}
