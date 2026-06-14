"use client";
import Script from "next/script";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CERTS = [
  { title: "Govt. Typing Certificate", sub: "Recognized for SSC, RRB & State exams", price: "₹199", icon: "🏛️", color: "#FFB800" },
  { title: "Data Entry Proficiency",   sub: "For BPO & corporate recruitment",        price: "₹149", icon: "📊", color: "#60A5FA" },
  { title: "Speed Typist Certificate", sub: "Shareable on LinkedIn & Naukri",         price: "₹249", icon: "⚡", color: "#00E5FF" },
];

declare global { interface Window { Razorpay: new (options: Record<string, unknown>) => { open(): void }; } }

export default function PricingPage() {
  const { data: session } = useSession();
  const router            = useRouter();
  const [yearly,  setYearly ] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  async function handlePurchase(plan: string, amount: number) {
    if (!session) { router.push("/signup"); return; }
    setError(null);
    setLoading(plan);

    try {
      const res     = await fetch("/api/payments/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body:   JSON.stringify({ plan, amount }),
      });
      const raw    = await res.text();
      let data: any = {};
      try { data = raw ? JSON.parse(raw) : {}; } catch { data = { error: raw || "Unexpected server response." }; }
      if (!res.ok) {
        throw new Error(data?.error || "Unable to create payment order.");
      }
      const { orderId, key } = data;

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout is not loaded yet. Please refresh the page.");
      }
      const rzp = new window.Razorpay({
        key,
        amount,
        currency: "INR",
        name:     "TypeGuru",
        description: plan,
        order_id: orderId,
        handler: async (response: Record<string, string>) => {
          await fetch("/api/payments/verify", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body:   JSON.stringify({ ...response, plan }),
          });
          router.push("/practice?upgraded=true");
        },
        prefill: { name: session.user.name, email: session.user.email },
        theme:   { color: "#00E5FF" },
      });
      rzp.open();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment failed. Please try again.";
      setError(message);
      console.error(err);
    } finally {
      setLoading(null);
    }
  }

  const plans = [
    {
      name: "Free", price: "₹0", sub: "Forever free", color: "#58698A", popular: false,
      plan: null, amount: 0,
      features: ["All 5 modes: General, Govt, Data, Coding, Arabic", "60-second timed tests", "Basic progress tracking", "Leaderboard access", "5 tests per day"],
      cta: "Start Free",
    },
    {
      name: "Pro", price: yearly ? "₹199" : "₹299", sub: yearly ? "/mo · billed yearly" : "/month",
      color: "#00E5FF", popular: true,
      plan: yearly ? "pro_yearly" : "pro_monthly",
      amount: yearly ? 199900 : 29900,
      features: ["Unlimited daily tests", "Full AI weakness analysis", "Personalized drill plans", "Discounted certificates", "Ad-free · Priority support"],
      cta: "Start 7-Day Trial",
    },
    {
      name: "Day Pass", price: "₹11", sub: "/day · No commitment", color: "#FFB800", popular: false,
      plan: "daypass", amount: 1100,
      features: ["Full Pro access for 24 hours", "All modes unlocked", "AI coaching included", "Perfect for exam-day prep", "Instant access"],
      cta: "Buy Day Pass",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-5 py-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Simple, Honest Pricing</h1>
        <p className="text-text-muted mb-5">Practice all modes free. Pay only when you want a verified certificate or premium coaching features.</p>
        <div className="inline-flex bg-bg-tertiary rounded-xl p-1 gap-1">
          {[[false,"Monthly"],[true,"Yearly 🎉 −33%"]].map(([v,l]) => (
            <button key={String(v)} onClick={() => setYearly(v as boolean)}
              className="text-xs font-bold px-4 py-2 rounded-lg transition-all"
              style={{
                background: yearly === v ? "#00E5FF" : "transparent",
                color:      yearly === v ? "#000" : "#58698A",
              }}>
              {l as string}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {error && (
          <div className="col-span-1 md:col-span-3 card p-4 bg-[#4C1D95]/10 border border-[#4C1D95]/20 text-sm text-[#E9D5FF]">
            {error}
          </div>
        )}
        {plans.map((p) => (
          <div key={p.name}
            className="card p-6 relative transition-all duration-300 hover:-translate-y-1"
            style={{
              borderColor: p.popular ? p.color + "38" : "rgba(0,229,255,0.11)",
              transform:   p.popular ? "scale(1.02)" : "scale(1)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = p.color + "52"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = p.popular ? p.color + "38" : "rgba(0,229,255,0.11)"; }}>

            {p.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2
                bg-gradient-to-r from-brand-cyan to-blue-500 text-black text-[10px] font-black
                px-3 py-0.5 rounded-full whitespace-nowrap">
                ⭐ MOST POPULAR
              </div>
            )}

            <div className="mb-4">
              <div className="font-bold text-lg mb-1" style={{ color: p.color }}>{p.name}</div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-bold text-3xl">{p.price}</span>
                <span className="text-text-muted text-xs">{p.sub}</span>
              </div>
            </div>

            <ul className="space-y-2 mb-5">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-[13px]">
                  <span style={{ color: p.color }} className="shrink-0">✓</span>
                  <span className="text-[#C0CDE8]">{f}</span>
                </li>
              ))}
            </ul>

            <button
              disabled={loading === p.plan}
              onClick={() => {
                if (!p.plan) { router.push(session ? "/practice" : "/signup"); return; }
                handlePurchase(p.plan, p.amount);
              }}
              className="w-full py-2.5 rounded-xl font-bold text-sm transition-all"
              style={{
                background:  p.popular ? "linear-gradient(135deg,#00E5FF,#0099FF)" : p.color + "16",
                border:      p.popular ? "none" : `1px solid ${p.color}32`,
                color:       p.popular ? "#000" : p.color,
                opacity:     loading ? 0.7 : 1,
              }}>
              {loading === p.plan ? "Processing..." : p.cta}
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-center text-xl font-bold mb-5">🎓 Typing Certificates</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {CERTS.map((c) => (
          <div key={c.title}
            className="card p-5 transition-all hover:-translate-y-1 cursor-pointer"
            style={{ borderColor: c.color + "25" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.color + "50"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.color + "25"; }}>
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className="font-bold text-sm mb-1" style={{ color: c.color }}>{c.title}</div>
            <div className="text-text-muted text-xs mb-3">{c.sub}</div>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-lg">{c.price}</span>
              <Link href="/certificates" className="text-xs font-bold px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
                style={{ background: c.color + "15", borderColor: c.color + "30", color: c.color }}>
                Get Cert
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-7 bg-[#090F1C] border-brand-gold/20 text-center">
        <div className="text-3xl mb-2">🏢</div>
        <h3 className="text-xl font-bold text-brand-gold mb-2">Corporate & Recruitment Plans</h3>
        <p className="text-text-muted text-sm max-w-md mx-auto mb-5">
          Onboard teams, verify candidate typing skills, issue bulk certificates. Trusted by 200+ HR teams.
        </p>
        <a href="mailto:sales@typeguru.app"
          className="inline-flex items-center justify-center text-sm font-bold px-7 py-2.5 rounded-xl"
          style={{ background: "linear-gradient(135deg,#FFB800,#FF8800)", color: "#000" }}>
          Contact Sales →
        </a>
      </div>
    </div>
  );
}
