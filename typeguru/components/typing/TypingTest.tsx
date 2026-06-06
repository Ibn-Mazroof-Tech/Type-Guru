"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ModeSelector, MODES, type ModeId } from "./ModeSelector";
import { StatsBar } from "./StatsBar";
import { UpgradeModal } from "@/components/ui/UpgradeModal";
import { isPro } from "@/lib/utils";

const TEXTS: Record<ModeId, string[]> = {
  general: [
    "In Mumbai's busy festival season, families decorate their homes with glowing lights while the city hums with music and laughter. The train announcements echo through the platform and street vendors sell samosas with steaming chai.",
    "At the railway station in Delhi, travelers exchange chai and stories before boarding the early morning express to faraway towns. The conductor's whistle blows and the crowd moves in a steady rhythm as the sun rises.",
    "A calm morning in Bengaluru begins with cyclists on the road and students rushing to coaching classes with books in hand. The city wakes gently in the shadow of glass towers and quiet lakes.",
  ],
  government: [
    "The education ministry announced a new scholarship program for meritorious students from rural districts in Rajasthan and Uttar Pradesh. It will help them attend coaching centers and pursue competitive exams.",
    "A committee has been formed to review the public transport policy and improve bus services across the state. They will also evaluate last-mile connectivity and ticketing systems.",
    "The local civic body completed the survey of street lighting and sanitation facilities in 12 wards this quarter. The report recommends repairs, tree trimming, and new water points for residents.",
  ],
  data: [
    "Invoice: SBIL000442 | Customer: Anand Kumar | Payment: ₹12,750 | GST: 18% | Delivery: 28 June 2026 | Status: CONFIRMED. Please verify the address and ship by tomorrow afternoon.",
    "Order ID: WFG-8812 | Qty: 14 | Rate: ₹499 | Total: ₹6,986 | Discount: 10% | Net Payable: ₹6,287.40. The warehouse team will pack the shipment before 5pm.",
    "Daily sales report: 234 units sold, 19 returns, total value ₹1,18,560, average basket size ₹505.20. The merchandising team noticed a spike in online orders after the weekend sale.",
  ],
  coding: [
    "const calculateGst = (amount: number): number => amount * 0.18; const invoice = `IN-${Date.now()}`; console.log('GST amount:', calculateGst(12500)); This function helps generate the correct billing amount.",
    "function formatCurrency(value: number) { return `₹${value.toFixed(2)}`; } console.log(formatCurrency(1520.75)); Use this helper when rendering amounts for invoices and receipts.",
    "const getDistance = (cityA: string, cityB: string) => `${cityA} to ${cityB} by train is about 1200 km`; console.log(getDistance('Chennai', 'Bangalore'));",
  ],
  arabic: [
    "Practice your keystrokes with discipline and focus. Typing Urdu or Arabic script takes patience, but consistency builds speed. Each session should be longer than a few sentences.",
    "Every day, invest time in each word and sentence to improve both accuracy and flow when learning a new script. This will also increase your comfort with keyboard layout and rhythm.",
    "Start slowly and keep your hands relaxed. Correct rhythm is more important than speed during the first practice sessions. Gradually increase the duration and challenge yourself.",
  ],
};

const DURATION_OPTIONS = [
  { value: 60, label: "1 min" },
  { value: 120, label: "2 min" },
  { value: 300, label: "5 min" },
  { value: 600, label: "10 min" },
] as const;

const getRequiredTextLength = (duration: number) => {
  // Ensure enough text for fast typists across all durations.
  return Math.max(duration * 18, 900);
};

const getTextForMode = (id: ModeId, duration: number) => {
  const options = TEXTS[id];
  const targetLength = getRequiredTextLength(duration);
  let text = "";

  while (text.length < targetLength) {
    const next = options[Math.floor(Math.random() * options.length)];
    if (text.length > 0) text += " ";
    text += next;
  }

  return text.trim();
};

export function TypingTest() {
  const { data: session } = useSession();
  const router            = useRouter();
  const userPlan          = session?.user?.plan ?? "free";

  const [mode,      setMode     ] = useState<ModeId>("general");
  const [duration,  setDuration ] = useState<number>(60);
  const [text,      setText     ] = useState<string>(() => getTextForMode("general", 60));
  const [typed,     setTyped    ] = useState("");
  const [started,   setStarted  ] = useState(false);
  const [done,      setDone     ] = useState(false);
  const [time,      setTime     ] = useState<number>(60);
  const [wpm,       setWpm      ] = useState(0);
  const [grossWpm,  setGrossWpm ] = useState(0);
  const [acc,       setAcc      ] = useState(100);
  const [errors,    setErrors   ] = useState(0);
  const [upgrade,   setUpgrade  ] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startRef = useRef<number | null>(null);

  // ── Timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (started && !done) {
      timerRef.current = setInterval(() => {
        setTime((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setDone(true);
            setStarted(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, done]);

  // ── Save result when test ends ─────────────────────────────
  useEffect(() => {
    if (done && session?.user && wpm > 0) {
      fetch("/api/tests", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ wpm, accuracy: acc, errors, mode, duration }),
      }).catch(console.error);
    }
  }, [done, duration, mode, acc, errors, session?.user, wpm]);

  const handleType = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!started && val.length === 1) { setStarted(true); startRef.current = Date.now(); }
    setTyped(val);

    if (startRef.current) {
      const mins  = (Date.now() - startRef.current) / 60000;
      const words = val.trim().split(/\s+/).filter(Boolean).length;
      const gross = mins > 0.01 ? Math.round(words / mins) : 0;
      setGrossWpm(gross);

      let ok = 0, er = 0;
      for (let i = 0; i < val.length; i++) {
        if (val[i] === text[i]) ok++; else er++;
      }
      const net = mins > 0.01 ? Math.round((ok / 5) / mins) : 0;
      setWpm(net);
      setAcc(val.length > 0 ? Math.round((ok / val.length) * 100) : 100);
      setErrors(er);
    }

    if (val.length >= text.length) {
      clearInterval(timerRef.current!);
      setDone(true);
      setStarted(false);
    }
  }, [started, text]);

  const reset = useCallback((selectedMode?: ModeId, selectedDuration?: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const nextDuration = selectedDuration ?? duration;
    setTyped(""); setStarted(false); setDone(false);
    setTime(nextDuration); setWpm(0); setAcc(100); setErrors(0);
    setText(getTextForMode(selectedMode ?? mode, nextDuration));
    startRef.current = null;
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [duration, mode]);

  const selectMode = (id: ModeId) => {
    setMode(id);
    reset(id, duration);
  };

  const selectDuration = (value: number) => {
    setDuration(value);
    reset(mode, value);
  };
  const modeInfo   = MODES.find((m) => m.id === mode)!;
  const progress   = Math.round((typed.length / text.length) * 100);

  // ── Render typed text with colour coding ──────────────────
  const renderText = () =>
    text.split("").map((char, i) => {
      let style: React.CSSProperties = { color: "#27304A" };
      if (i < typed.length) {
        style = typed[i] === char
          ? { color: "#00E5FF" }
          : { color: "#FF4455", textDecoration: "underline wavy #FF4455" };
      } else if (i === typed.length) {
        style = { color: "#F0F4FF", background: "rgba(0,229,255,0.12)", borderBottom: "2px solid #00E5FF" };
      }
      return (
        <span key={i} style={style} className="font-mono">
          {char}
        </span>
      );
    });

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <UpgradeModal open={upgrade} onClose={() => setUpgrade(false)} />

      <ModeSelector
        selected={mode}
        onSelect={selectMode}
        onUpgrade={() => setUpgrade(true)}
        isPro={isPro(userPlan)}
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {DURATION_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => selectDuration(option.value)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${duration === option.value ? "bg-brand-cyan text-slate-900 border-brand-cyan" : "bg-bg-tertiary text-text-muted border-border hover:border-brand-cyan"}`}>
            {option.label}
          </button>
        ))}
      </div>

      <StatsBar wpm={wpm} accuracy={acc} time={time} errors={errors} />

      {/* Typing area */}
      <div
        className="card p-6 mb-3 cursor-text"
        onClick={() => inputRef.current?.focus()}>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{modeInfo.emoji}</span>
            <span className="text-xs font-bold" style={{ color: modeInfo.color }}>
              {modeInfo.label}
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
              style={{ background: modeInfo.color + "18", borderColor: modeInfo.color + "35", color: modeInfo.color }}>
              {modeInfo.sub}
            </span>
          </div>
          {started && !done ? (
            <div className="flex items-center gap-1.5 text-brand-cyan text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-blink inline-block" />
              Recording...
            </div>
          ) : !done ? (
            <span className="text-text-muted text-xs">Click here and start typing ↓</span>
          ) : null}
        </div>

        <div className="text-[15px] leading-[2.1] tracking-wide select-none min-h-[72px] break-words whitespace-pre-wrap">
          {renderText()}
        </div>

        <input
          ref={inputRef}
          value={typed}
          onChange={handleType}
          disabled={done}
          className="opacity-0 absolute w-px h-px pointer-events-none"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-bg-tertiary rounded-full mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-blue-500 transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Result / Controls */}
      {done ? (
        <div className="card p-7 text-center border-brand-cyan/25">
          <p className="text-text-muted text-xs mb-2">Test Complete! 🎉</p>
          <p className="font-mono text-5xl font-bold text-brand-cyan glow-text mb-1">{wpm} Net WPM</p>
          <p className="text-text-muted text-sm mb-6">
            Accuracy: {acc}% · Errors: {errors}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => reset()} className="btn-primary text-sm">↺ Try Again</button>
            {!session && (
              <button onClick={() => router.push("/signup")}
                className="btn-outline text-sm">
                Save Score →
              </button>
            )}
            <button
              onClick={() => router.push("/pricing")}
              className="border border-brand-gold/30 text-brand-gold text-sm px-5 py-2.5 rounded-xl hover:bg-brand-gold/10 transition-all">
              🎓 Get Certificate
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => reset()}
            className="bg-bg-tertiary text-text-muted border border-border text-xs px-4 py-2.5 rounded-xl hover:text-text-primary transition-all">
            ↺ Restart
          </button>
          <div className="flex-1 card bg-bg-tertiary px-4 py-2.5 text-xs text-text-muted">
            💡 PRO modes (Coding, Arabic) unlock for just ₹11/day
          </div>
        </div>
      )}
    </div>
  );
}
