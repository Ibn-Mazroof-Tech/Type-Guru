"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ModeSelector, MODES, type ModeId } from "./ModeSelector";
import { StatsBar } from "./StatsBar";

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
    "Daily sales report:\nDate: 28 Jun 2026\nTotal Units Sold: 234\nReturns: 19\nTotal Value: ₹1,18,560\nAverage Basket Size: ₹505.20\n\nNotes: The merchandising team noticed a spike in online orders after the weekend sale.",
    "Invoice Summary:\nInvoice: SBIL000442\nCustomer: Anand Kumar\nPayment: ₹12,750\nGST: 18%\nDelivery: 28 June 2026\nStatus: CONFIRMED\n\nPlease verify the address and ship by tomorrow afternoon.",
    "Order Line:\nOrder ID: WFG-8812\nQty: 14\nRate: ₹499\nDiscount: 10%\nTotal: ₹6,986\nNet Payable: ₹6,287.40\n\nPacking: Warehouse to pack shipment before 5pm.",
  ],
  coding: [
    "const calculateGst = (amount: number): number => amount * 0.18; const invoice = `IN-${Date.now()}`; console.log('GST amount:', calculateGst(12500)); This function helps generate the correct billing amount.",
    "function formatCurrency(value: number) { return `₹${value.toFixed(2)}`; } console.log(formatCurrency(1520.75)); Use this helper when rendering amounts for invoices and receipts.",
    "const getDistance = (cityA: string, cityB: string) => `${cityA} to ${cityB} by train is about 1200 km`; console.log(getDistance('Chennai', 'Bangalore'));",
  ],
  arabic: [
    "آج کے دور میں ٹائپنگ کی مشق مستقل مزاجی سے کریں۔ آہستہ آہستہ رفتار بڑھائیں اور اپنی درستگی پر توجہ دیں۔",
    "ہر روز کچھ نئے الفاظ اور جملے لکھیں تاکہ کی بورڈ کے لے آؤٹ اور انگوٹھے کی مشق بہتر ہو سکے۔ صبر اور محنت سے مہارت آتی ہے۔",
    "شروع میں رفتار سے زیادہ ریتم اور درستگی پر توجہ دیں۔ جملوں کو دھیرے دھیرے سبق وار لکھیں اور ہر سیشن میں تھوڑا سا انتظام بڑھائیں۔",
  ],
  race: [
    "The track is ready. Type quickly and watch your car pull ahead. Keep your focus on every word, and don't let the AI catch up.",
    "Traffic lights turn green, the engine roars, and your fingers fly across the keys. Stay smooth and accurate to win the race.",
    "The finish line is near. Keep your speed steady and your accuracy high to beat the opponent in Race Mode.",
  ],
  falling: [
    "type",
    "quick",
    "speed",
    "focus",
    "power",
    "learn",
    "skill",
    "practice",
    "master",
    "fast",
    "text",
    "word",
    "level",
    "score",
    "reach",
    "build",
    "train",
    "flow",
    "move",
    "steady",
  ],
  "word-builder": [
    "plane",
    "juice",
    "light",
    "sound",
    "brick",
    "puzzle",
    "vision",
    "market",
    "script",
    "engine",
    "random",
    "design",
    "layout",
    "master",
    "create",
    "coding",
    "mobile",
    "strong",
    "shrink",
    "unique",
  ],
};

const DURATION_OPTIONS = [
  { value: 60, label: "1 min" },
  { value: 120, label: "2 min" },
  { value: 300, label: "5 min" },
  { value: 600, label: "10 min" },
] as const;

const CODE_LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "csharp", label: "C#" },
  { id: "c", label: "C" },
  { id: "web", label: "Web" },
] as const;

type CodeLanguage = typeof CODE_LANGUAGES[number]["id"];

const CODE_TEXTS: Record<CodeLanguage, string[]> = {
  javascript: [
    "function formatCurrency(value) {\n    return `₹${value.toFixed(2)}`;\n}\nconsole.log(formatCurrency(1520.75));",
    "const invoice = { id: `INV-${Date.now()}`, amount: 1299, tax: 0.18 };\nconsole.log('Total:', invoice.amount + invoice.amount * invoice.tax);",
    "const getDistance = (cityA, cityB) => `${cityA} to ${cityB} is about 1200 km`;\nconsole.log(getDistance('Chennai', 'Bangalore'));",
  ],
  python: [
    "def calculate_gst(amount):\n    return round(amount * 0.18, 2)\n\nprint(f'GST amount: ₹{calculate_gst(12500)}')",
    "orders = [234, 199, 450]\nfor order in orders:\n    print('Order ID:', order)",
    "class Invoice:\n    def __init__(self, total):\n        self.total = total\n\n    def tax(self):\n        return self.total * 0.18",
  ],
  java: [
    "public class Main {\n    public static void main(String[] args) {\n        double amount = 12500;\n        System.out.println(\"GST amount: \" + calculateGst(amount));\n    }\n\n    static double calculateGst(double amount) {\n        return amount * 0.18;\n    }\n}",
    "for (int i = 0; i < 3; i++) {\n    System.out.println(\"Line \" + (i + 1));\n}",
  ],
  cpp: [
    "#include <iostream>\nusing namespace std;\n\nint main() {\n    double amount = 12500;\n    cout << \"GST amount: \" << amount * 0.18 << endl;\n    return 0;\n}",
    "vector<int> values = {234, 199, 450};\nfor (int value : values) {\n    cout << value << endl;\n}",
  ],
  csharp: [
    "using System;\n\nclass Program {\n    static void Main() {\n        double amount = 12500;\n        Console.WriteLine($\"GST amount: {amount * 0.18}\");\n    }\n}",
  ],
  c: [
    "#include <stdio.h>\n\nint main() {\n    double amount = 12500;\n    printf(\"GST amount: %.2f\\n\", amount * 0.18);\n    return 0;\n}",
  ],
  web: [
    "<!DOCTYPE html>\n<html>\n<head>\n    <style>body { font-family: Arial; }</style>\n</head>\n<body>\n    <h1>Invoice</h1>\n    <script>\n        const total = 1299;\n        console.log(`Total: ₹${total}`);\n    </script>\n</body>\n</html>",
  ],
};

const FALLING_WORDS = [
  "type", "quick", "learn", "speed", "power", "focus", "skill", "practice", "master",
  "fast", "text", "word", "level", "score", "reach", "build", "train", "flow", "move", "steady",
];

const WORD_BUILDER_WORDS = [
  "plane", "juice", "light", "sound", "brick", "puzzle", "vision", "market", "script",
  "engine", "random", "design", "layout", "master", "create", "coding", "mobile", "strong",
  "shrink", "unique",
] as const;

const scrambleWord = (word: string) => {
  const chars = word.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
};

const getRequiredTextLength = (duration: number) => {
  // Ensure enough text for fast typists across all durations.
  return Math.max(duration * 18, 900);
};

const getTextForMode = (id: ModeId, duration: number, codeLanguage: CodeLanguage = "javascript") => {
  if (id === "coding") {
    const options = CODE_TEXTS[codeLanguage];
    const targetLength = getRequiredTextLength(duration);
    let text = "";

    while (text.length < targetLength) {
      const next = options[Math.floor(Math.random() * options.length)];
      if (text.length > 0) text += "\n\n";
      text += next;
    }

    return text.trim();
  }

  if (id === "race") {
    const options = TEXTS.race;
    const targetLength = getRequiredTextLength(duration);
    let text = "";

    while (text.length < targetLength) {
      const next = options[Math.floor(Math.random() * options.length)];
      if (text.length > 0) text += " ";
      text += next;
    }
    return text.trim();
  }

  if (id === "falling") {
    const options = TEXTS.falling;
    const count = Math.max(20, Math.floor(duration / 3));
    return Array.from({ length: count }, () => options[Math.floor(Math.random() * options.length)]).join(" ");
  }

  if (id === "word-builder") {
    const options = TEXTS["word-builder"];
    return options[Math.floor(Math.random() * options.length)];
  }

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
  const [scrambledWord, setScrambledWord] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [started,   setStarted  ] = useState(false);
  const [done,      setDone     ] = useState(false);
  const [time,      setTime     ] = useState<number>(60);
  const [wpm,       setWpm      ] = useState(0);
  const [grossWpm,  setGrossWpm ] = useState(0);
  const [acc,       setAcc      ] = useState(100);
  const [errors,    setErrors   ] = useState(0);
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>("javascript");
  const [transliterationEnabled, setTransliterationEnabled] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startRef = useRef<number | null>(null);

  // Fetch remote text samples for variability
  const fetchGeneralText = async (desiredLength: number) => {
    try {
      const res = await fetch("https://baconipsum.com/api/?type=meat-and-filler&paras=3&format=text");
      if (!res.ok) return null;
      const t = await res.text();
      return t.slice(0, Math.max(desiredLength, 400));
    } catch (err) {
      return null;
    }
  };

  const fetchDataEntryText = async () => {
    try {
      const entries: string[] = [];
      for (let i = 0; i < 4; i++) {
        const r = await fetch('https://random-data-api.com/api/commerce/random_commerce');
        if (!r.ok) continue;
        const j = await r.json();
        entries.push(`Invoice:\nProduct: ${j.product_name}\nSKU: ${j.uid}\nPrice: ₹${j.price}\nCategory: ${j.department}`);
      }
      return entries.join('\n\n');
    } catch (err) {
      return null;
    }
  };

  const prepareGameMode = useCallback((selectedMode: ModeId, selectedDuration: number, selectedLanguage: CodeLanguage) => {
    if (selectedMode === "word-builder") {
      const word = WORD_BUILDER_WORDS[Math.floor(Math.random() * WORD_BUILDER_WORDS.length)];
      setTargetWord(word);
      setScrambledWord(scrambleWord(word));
      setText(word);
      return;
    }

    if (selectedMode === "falling") {
      const count = Math.max(20, Math.floor(selectedDuration / 3));
      const words = Array.from({ length: count }, () => FALLING_WORDS[Math.floor(Math.random() * FALLING_WORDS.length)]);
      setText(words.join(" "));
      setScrambledWord("");
      setTargetWord("");
      return;
    }

    if (selectedMode === "race") {
      setText(getTextForMode("race", selectedDuration));
      setScrambledWord("");
      setTargetWord("");
      return;
    }

    setScrambledWord("");
    setTargetWord("");
    if (selectedMode === "coding") {
      setText(getTextForMode("coding", selectedDuration, selectedLanguage));
      return;
    }
    setText(getTextForMode(selectedMode, selectedDuration, selectedLanguage));
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (mode === 'data') {
        const remote = await fetchDataEntryText();
        if (mounted && remote) setText(remote);
      } else if (mode === 'general') {
        const remote = await fetchGeneralText(duration);
        if (mounted && remote) setText(remote);
      } else if (mode === 'coding') {
        // regenerate code text for selected language
        setText(getTextForMode('coding', duration, codeLanguage));
      } else {
        // keep existing behaviour for other modes
        setText(getTextForMode(mode, duration, codeLanguage));
      }
    })();
    return () => { mounted = false; };
  }, [mode, duration, codeLanguage]);

  useEffect(() => {
    if (mode === 'word-builder' || mode === 'falling' || mode === 'race') {
      prepareGameMode(mode, duration, codeLanguage);
    }
  }, [mode, duration, codeLanguage, prepareGameMode]);

  // ── Transliteration (Urdu) ─────────────────────────────────
  useEffect(() => {
    if (!transliterationEnabled || mode !== "arabic" || !inputRef.current) return;

    let $: any = null;
    let imeInstance: any = null;
    let mounted = true;

    (async () => {
      try {
        const jq = await import('jquery');
        $ = jq.default ?? jq;
        // dynamically import jquery.ime bundle
        await import('jquery.ime/dist/jquery.ime/jquery.ime.min.js');

        if (!mounted) return;
        const $el = $(inputRef.current);
        $el.ime();
        imeInstance = $el.data('ime');
        // try to set a phonetic Urdu IM from a list of common ids
        const tries = ['urd-phonetic', 'ur-phonetic', 'urdu-phonetic', 'ur'];
        for (const id of tries) {
          try {
            if (imeInstance && imeInstance.setIM) {
              imeInstance.setIM(id);
              break;
            }
          } catch (e) {
            // ignore and try next
          }
        }
      } catch (err) {
        // fail silently; transliteration will not work
        console.error('Transliteration init failed', err);
      }
    })();

    return () => {
      mounted = false;
      try {
        if ($ && inputRef.current) {
          const $el = $(inputRef.current);
          const inst = $el.data('ime');
          if (inst && inst.disable) inst.disable();
        }
      } catch (_) {}
    };
  }, [transliterationEnabled, mode]);

  // ── Keep typing area scrolled into view ───────────────────────
  useEffect(() => {
    const container = textAreaRef.current;
    if (!container) return;

    const activeChar = container.querySelector<HTMLSpanElement>("[data-active='true']");
    if (activeChar) {
      activeChar.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [typed, text]);

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

  const handleType = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const reset = useCallback((selectedMode?: ModeId, selectedDuration?: number, selectedLanguage?: CodeLanguage) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const nextDuration = selectedDuration ?? duration;
    setTyped(""); setStarted(false); setDone(false);
    setTime(nextDuration); setWpm(0); setAcc(100); setErrors(0);
    prepareGameMode(selectedMode ?? mode, nextDuration, selectedLanguage ?? codeLanguage);
    startRef.current = null;
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [codeLanguage, duration, mode]);

  const selectMode = (id: ModeId) => {
    // For full-game modes, navigate to their dedicated pages.
    if (id === "race" || id === "falling" || id === "word-builder") {
      router.push(`/games/${id}`);
      return;
    }

    setMode(id);
    reset(id, duration, id === "coding" ? codeLanguage : undefined);
  };

  const selectDuration = (value: number) => {
    setDuration(value);
    reset(mode, value, mode === "coding" ? codeLanguage : undefined);
  };

  const changeCodeLanguage = (language: CodeLanguage) => {
    setCodeLanguage(language);
    if (mode === "coding") {
      reset("coding", duration, language);
    }
  };
  const modeInfo   = MODES.find((m) => m.id === mode)!;
  const progress   = Math.round((typed.length / text.length) * 100);

  // ── Render typed text with colour coding ──────────────────
  const renderText = () =>
    text.split("").map((char, i) => {
      let style: React.CSSProperties = { color: "#D8E4FF" };
      const isActive = i === typed.length;
      if (i < typed.length) {
        style = typed[i] === char
          ? { color: "#00E5FF" }
          : { color: "#FF4455", textDecoration: "underline wavy #FF4455" };
      } else if (isActive) {
        style = { color: "#F0F4FF", background: "rgba(0,229,255,0.12)", borderBottom: "2px solid #00E5FF" };
      }
      return (
        <span key={i} style={style} className="font-mono" data-active={isActive ? "true" : undefined}>
          {char}
        </span>
      );
    });

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <ModeSelector
        selected={mode}
        onSelect={selectMode}
      />

      {mode === "coding" && (
        <div className="mb-5">
          <div className="text-text-muted text-xs font-semibold mb-2">Choose language</div>
          <div className="flex flex-wrap gap-2">
            {CODE_LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => changeCodeLanguage(lang.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${codeLanguage === lang.id ? "bg-brand-cyan text-slate-900 border-brand-cyan" : "bg-bg-tertiary text-text-muted border-border hover:border-brand-cyan"}`}>
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "arabic" && (
        <div className="mb-4 flex items-center gap-3">
          <label className="text-xs text-text-muted">Enable Urdu Transliteration</label>
          <button
            type="button"
            onClick={() => setTransliterationEnabled((s) => !s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${transliterationEnabled ? "bg-brand-cyan text-slate-900 border-brand-cyan" : "bg-bg-tertiary text-text-muted border-border hover:border-brand-cyan"}`}>
            {transliterationEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      )}

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
        className="card relative p-6 mb-3 cursor-text"
        onClick={() => inputRef.current?.focus({ preventScroll: true })}>

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

        <div
          ref={textAreaRef}
          className="text-[15px] leading-[2.1] tracking-wide select-none min-h-[72px] break-words whitespace-pre-wrap"
          style={{
            maxHeight: "calc(100vh - 420px)",
            overflowY: "auto",
            direction: mode === "arabic" ? "rtl" : "ltr",
            textAlign: mode === "arabic" ? "right" : "left",
            fontFamily: mode === "arabic" ? "'Noto Nastaliq Urdu', 'Noto Naskh Arabic', serif" : undefined,
          }}>
          {renderText()}
        </div>

        <textarea
          ref={inputRef}
          value={typed}
          onChange={handleType}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              const target = e.currentTarget;
              const start = target.selectionStart ?? 0;
              const end = target.selectionEnd ?? 0;
              const next = typed.slice(0, start) + "    " + typed.slice(end);
              setTyped(next);
              window.requestAnimationFrame(() => {
                if (inputRef.current) {
                  inputRef.current.selectionStart = inputRef.current.selectionEnd = start + 4;
                }
              });
              if (!started) {
                setStarted(true);
                startRef.current = Date.now();
              }
            }
          }}
          disabled={done}
          className="opacity-0 absolute inset-0 w-full h-full resize-none"
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
