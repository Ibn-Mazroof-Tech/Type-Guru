import Link from "next/link";
import { auth } from "@/lib/auth/config";
import HomeFeatures from "@/components/HomeFeatures";

export default async function HomePage() {
  const session = await auth();

  const features = [
    { icon: "🤖", title: "AI Weakness Coach",    color: "#00E5FF", desc: "Analyzes every keystroke. Finds your weakest keys. Generates personalized drills targeting your exact problems automatically." },
    { icon: "🏛️", title: "Govt. Exam Prep",       color: "#FFB800", desc: "SSC CHSL, RRB NTPC, High Court Typist, CPCT — practice tests that match official exam format and difficulty exactly." },
    { icon: "💻", title: "Code Typing",            color: "#00FF94", desc: "Type real Python, JS, and SQL snippets. Built for developers who want to write code at the speed of thought." },
    { icon: "🕌", title: "Arabic & Urdu",          color: "#C084FC", desc: "Quran verses and Urdu text with native keyboard layouts and right-to-left script support. A completely underserved market." },
    { icon: "🏆", title: "Verified Certificates", color: "#60A5FA", desc: "Recruiter-recognized certificates from ₹149. Shareable on LinkedIn, Naukri, and Indeed — verifiable by HR teams." },
    { icon: "🎮", title: "Gamified Learning",      color: "#FF8844", desc: "Daily streaks, XP points, rank badges, national leaderboard. Typing practice that keeps you coming back every day." },
  ];

  const stats = [
    { value: "2,47,800+", label: "Active Learners" },
    { value: "32 Lakh+",  label: "Tests Completed" },
    { value: "68 WPM",    label: "Platform Average" },
    { value: "500+",      label: "Hiring Partners"  },
  ];

  return (
    <div className="max-w-5xl mx-auto px-5">
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="text-center py-16"
        style={{
          backgroundImage: "linear-gradient(rgba(0,229,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.022) 1px,transparent 1px)",
          backgroundSize: "42px 42px",
        }}>

        <div className="inline-flex items-center gap-2 bg-brand-cyan/[0.08] border border-brand-cyan/20 rounded-3xl px-4 py-1.5 text-brand-cyan text-xs mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ring-pulse inline-block" />
          India&apos;s Most Advanced AI Typing Platform — Beta
        </div>

        <h1 className="font-brand font-black text-[clamp(28px,5vw,60px)] leading-[1.1] tracking-tight mb-4">
          Type Faster.<br />
          <span className="text-brand-cyan glow-text">Think Smarter.</span><br />
          Get Hired.
        </h1>

        <p className="text-text-muted text-[clamp(14px,1.8vw,17px)] max-w-[500px] mx-auto mb-7 leading-[1.8]">
          AI-powered typing coach for government aspirants, data entry professionals,
          developers & Arabic learners. Join 2.4 lakh+ learners across India.
        </p>

        <div className="flex gap-3 justify-center flex-wrap mb-12">
          <Link href="/practice" className="btn-primary text-[15px]">
            🚀 Start Typing Free
          </Link>
          <Link href="/pricing" className="btn-outline text-[14px]">
            View Plans →
          </Link>
        </div>

        <div className="flex flex-wrap gap-10 justify-center">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-mono font-bold text-2xl text-brand-cyan glow-text">{s.value}</div>
              <div className="text-text-muted text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent my-2 mb-12" />

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-center text-2xl font-bold mb-8">Everything to Master Typing</h2>
        <HomeFeatures features={features} />
      </section>

      {/* ── SOCIAL PROOF ──────────────────────────────────── */}
      <section className="mb-16">
        <div className="card p-6 bg-[#09151F] border-brand-gold/20 flex items-center gap-5 flex-wrap">
          <div className="text-4xl">🎓</div>
          <div className="flex-1 min-w-[180px]">
            <div className="font-bold text-base text-brand-gold mb-1">Trusted by Govt. Aspirants Across India</div>
            <div className="text-text-muted text-sm leading-relaxed">
              Students prepping for SSC CHSL, RRB NTPC, High Court Typist & CPCT use TypeGuru as their primary practice platform.
            </div>
          </div>
          {[["87%","Pass Rate"],["4.8★","App Rating"],["92%","Recommend"]].map(([v,l]) => (
            <div key={l} className="text-center px-3">
              <div className="text-brand-gold font-black text-2xl">{v}</div>
              <div className="text-text-muted text-xs">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      {!session && (
        <section className="text-center mb-20">
          <div className="card p-10 border-brand-cyan/20 bg-gradient-to-b from-bg-secondary to-bg-primary">
            <h2 className="font-brand text-2xl font-black text-brand-cyan mb-3">Ready to Type Faster?</h2>
            <p className="text-text-muted text-sm mb-6">Join free. No credit card required.</p>
            <Link href="/signup" className="btn-primary text-base px-10">
              Create Free Account →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
