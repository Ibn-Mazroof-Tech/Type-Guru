import { Metadata } from "next";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { typingTests } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { KeyboardHeatmap } from "@/components/coach/KeyboardHeatmap";
import { WeeklyChart } from "@/components/coach/WeeklyChart";
import { DrillCards } from "@/components/coach/DrillCard";
import { redirect } from "next/navigation";
import { isPro } from "@/lib/utils";

export const metadata: Metadata = { title: "AI Coach — TypeGuru" };

export default async function CoachPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (!isPro(session.user.plan)) redirect("/pricing?upgrade=true");

  const recentTests = await db
    .select()
    .from(typingTests)
    .where(eq(typingTests.userId, session.user.id))
    .orderBy(desc(typingTests.completedAt))
    .limit(7);

  const weeklyWpm = recentTests.length > 0
    ? recentTests.reverse().map((t) => t.wpm)
    : [45, 52, 49, 61, 68, 72, 78];

  return (
    <div className="max-w-4xl mx-auto px-5 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold mb-1">
          🤖 <span className="text-brand-cyan">AI Typing Coach</span>
        </h1>
        <p className="text-text-muted text-sm">
          Keystroke-level analysis · Session WPM: {recentTests[0]?.wpm ?? 0}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeeklyChart data={weeklyWpm} />

        <div className="card p-5">
          <h3 className="font-bold text-brand-purple text-sm mb-4">🧠 AI Weak Key Insights</h3>
          {[
            { k:"J", s:32, tip:"Right index struggles with J. Drill: jar, joy, just — 3 min daily." },
            { k:"Z", s:28, tip:"Weakest key. Practice: zone, zero, zoom. Keep pinky extended." },
            { k:"V", s:35, tip:"Low accuracy. Relax wrist; drill: view, value, vast slowly." },
            { k:"F", s:48, tip:"F anchor key needs work. Return to home row after every F." },
          ].map((tip, i) => (
            <div key={tip.k} className={`mb-3 pb-3 ${i < 3 ? "border-b border-border" : ""}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono font-bold text-sm px-2 py-0.5 rounded"
                  style={{ background: "rgba(255,68,85,0.1)", border: "1px solid rgba(255,68,85,0.28)", color: "#FF4455" }}>
                  {tip.k}
                </span>
                <div className="flex-1 h-1 bg-bg-tertiary rounded-full">
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${tip.s}%`,
                      background: tip.s < 40 ? "#FF4455" : tip.s < 60 ? "#FF8844" : "#FFB800",
                    }} />
                </div>
                <span className="text-text-muted text-xs">{tip.s}%</span>
              </div>
              <p className="text-text-muted text-xs leading-relaxed">{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>

      <KeyboardHeatmap />
      <DrillCards />
    </div>
  );
}
