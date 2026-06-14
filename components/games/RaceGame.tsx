"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const AI_WPM = {
  starter: 30,
  experienced: 50,
  pro: 80,
  hackerMin: 100,
  hackerMax: 150,
} as const;

const SENTENCES = [
  "Practice makes perfect. Keep your eyes on the screen and fingers on the home row.",
  "The quick brown fox jumps over the lazy dog multiple times to warm up your typing.",
  "Focus on accuracy first, speed will follow naturally as your fingers memorize the patterns.",
];

const CODE_SNIPPETS = [
  "function sum(a, b) { return a + b; } console.log(sum(5, 7));",
  "const greet = (name) => `Hello ${name}`; console.log(greet('World'));",
  "def hello():\n    print('Hello, world')\nhello()",
];

type AiLevel = "starter" | "experienced" | "pro" | "hacker";
type ContentType = "sentences" | "code";
type FinishReason = "player" | "ai" | "time" | "stopped";

type RaceResult = {
  winner: "player" | "ai" | "draw";
  elapsedSeconds: number;
  grossWpm: number;
  netWpm: number;
  mistakes: number;
};

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function getContent(contentType: ContentType) {
  return contentType === "code" ? pickRandom(CODE_SNIPPETS) : pickRandom(SENTENCES);
}

function getAiWpm(level: AiLevel) {
  if (level === "hacker") {
    return Math.floor(Math.random() * (AI_WPM.hackerMax - AI_WPM.hackerMin + 1)) + AI_WPM.hackerMin;
  }

  return AI_WPM[level];
}

function countMistakes(typed: string, content: string) {
  let mistakes = 0;
  const checkedLength = Math.min(typed.length, content.length);

  for (let i = 0; i < checkedLength; i++) {
    if (typed[i] !== content[i]) mistakes++;
  }

  return mistakes + Math.abs(typed.length - content.length);
}

export default function RaceGame() {
  const [duration, setDuration] = useState(60);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [typed, setTyped] = useState("");
  const [playerProgress, setPlayerProgress] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiWpm, setAiWpm] = useState<number>(AI_WPM.experienced);
  const [aiLevel, setAiLevel] = useState<AiLevel>("experienced");
  const [contentType, setContentType] = useState<ContentType>("sentences");
  const [content, setContent] = useState(() => getContent("sentences"));
  const [result, setResult] = useState<RaceResult | null>(null);

  const intervalRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const contentRef = useRef(content);
  const typedRef = useRef("");
  const aiCharsRef = useRef(0);
  const aiWpmRef = useRef<number>(aiWpm);
  const playerProgressRef = useRef(0);
  const aiProgressRef = useRef(0);

  const requiredChars = Math.max(1, content.length);

  const clearRaceTimer = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const finishRace = useCallback((reason: FinishReason) => {
    if (!startedRef.current) return;

    clearRaceTimer();
    startedRef.current = false;
    setStarted(false);

    const currentContent = contentRef.current;
    const currentTyped = typedRef.current.slice(0, currentContent.length);
    const elapsedMs = Math.max(1, Date.now() - (startRef.current ?? Date.now()));
    const elapsedMinutes = elapsedMs / 60000;
    const mistakes = countMistakes(currentTyped, currentContent);
    const typedChars = Math.min(currentTyped.length, currentContent.length);
    const grossWpm = Math.round((typedChars / 5) / elapsedMinutes);
    const netWpm = Math.max(0, Math.round(((typedChars - mistakes) / 5) / elapsedMinutes));

    let winner: RaceResult["winner"] = "draw";
    if (reason === "player") {
      winner = "player";
      playerProgressRef.current = 100;
      setPlayerProgress(100);
    } else if (reason === "ai") {
      winner = "ai";
      aiProgressRef.current = 100;
      setAiProgress(100);
    } else if (reason === "time") {
      if (playerProgressRef.current > aiProgressRef.current) winner = "player";
      if (aiProgressRef.current > playerProgressRef.current) winner = "ai";
    }

    setResult({
      winner,
      elapsedSeconds: Math.round(elapsedMs / 1000),
      grossWpm,
      netWpm,
      mistakes,
    });
  }, [clearRaceTimer]);

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    typedRef.current = typed;
  }, [typed]);

  useEffect(() => {
    aiWpmRef.current = aiWpm;
  }, [aiWpm]);

  useEffect(() => {
    if (!started) {
      clearRaceTimer();
      return;
    }

    lastTickRef.current = Date.now();
    const endAt = (startRef.current ?? Date.now()) + duration * 1000;

    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const lastTick = lastTickRef.current ?? now;
      const deltaSeconds = (now - lastTick) / 1000;
      const raceLength = Math.max(1, contentRef.current.length);

      lastTickRef.current = now;
      aiCharsRef.current += (aiWpmRef.current * 5 / 60) * deltaSeconds;

      const nextAiProgress = Math.min(100, Math.round((aiCharsRef.current / raceLength) * 100));
      aiProgressRef.current = nextAiProgress;
      setAiProgress(nextAiProgress);

      const nextTimeLeft = Math.max(0, Math.ceil((endAt - now) / 1000));
      setTimeLeft(nextTimeLeft);

      if (aiCharsRef.current >= raceLength) {
        finishRace("ai");
      } else if (nextTimeLeft <= 0) {
        finishRace("time");
      }
    }, 250);

    return clearRaceTimer;
  }, [started, duration, finishRace, clearRaceTimer]);

  useEffect(() => {
    if (!started) setTimeLeft(duration);
  }, [duration, started]);

  const startRace = () => {
    const nextContent = getContent(contentType);
    const nextAiWpm = getAiWpm(aiLevel);

    clearRaceTimer();
    contentRef.current = nextContent;
    typedRef.current = "";
    aiCharsRef.current = 0;
    aiWpmRef.current = nextAiWpm;
    playerProgressRef.current = 0;
    aiProgressRef.current = 0;
    startRef.current = Date.now();
    lastTickRef.current = Date.now();
    startedRef.current = true;

    setContent(nextContent);
    setTyped("");
    setTimeLeft(duration);
    setAiWpm(nextAiWpm);
    setPlayerProgress(0);
    setAiProgress(0);
    setResult(null);
    setStarted(true);
  };

  const stopRace = () => {
    finishRace("stopped");
  };

  const handleTypedChange = (value: string) => {
    const limitedValue = value.slice(0, contentRef.current.length);
    const progress = Math.min(100, Math.round((limitedValue.length / Math.max(1, contentRef.current.length)) * 100));

    typedRef.current = limitedValue;
    playerProgressRef.current = progress;
    setTyped(limitedValue);
    setPlayerProgress(progress);

    if (startedRef.current && progress >= 100) {
      finishRace("player");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <h2 className="text-xl font-bold mb-3">Race Mode</h2>
      <p className="text-text-muted mb-4">
        Race against an AI opponent. Finish the shown text before the timer or opponent reaches the line.
      </p>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <label className="text-sm text-text-muted">
          <span className="block mb-1">Duration</span>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={started}
            className="px-3 py-2 rounded border border-border bg-bg-tertiary text-text-primary"
          >
            <option value={30}>30s</option>
            <option value={60}>60s</option>
            <option value={120}>120s</option>
          </select>
        </label>

        <label className="text-sm text-text-muted">
          <span className="block mb-1">AI Level</span>
          <select
            value={aiLevel}
            onChange={(e) => setAiLevel(e.target.value as AiLevel)}
            disabled={started}
            className="px-3 py-2 rounded border border-border bg-bg-tertiary text-text-primary"
          >
            <option value="starter">Starter (30 WPM)</option>
            <option value="experienced">Experienced (50 WPM)</option>
            <option value="pro">Pro (80 WPM)</option>
            <option value="hacker">Hacker (100-150 WPM)</option>
          </select>
        </label>

        <label className="text-sm text-text-muted">
          <span className="block mb-1">Content</span>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
            disabled={started}
            className="px-3 py-2 rounded border border-border bg-bg-tertiary text-text-primary"
          >
            <option value="sentences">Sentences</option>
            <option value="code">Code</option>
          </select>
        </label>

        <div className="ml-auto flex gap-2">
          <button onClick={startRace} className="btn-primary">
            {result ? "Play Again" : "Start Race"}
          </button>
          <button onClick={stopRace} disabled={!started} className="btn-outline disabled:opacity-50">
            Stop
          </button>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <div className="mb-3 flex items-center justify-between text-xs text-text-muted">
          <span>Time left: {timeLeft}s</span>
          <span>Opponent speed: {aiWpm} WPM</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-[12px] text-text-muted mb-1">
            <div>You</div>
            <div>{playerProgress}%</div>
          </div>
          <div className="w-full h-4 bg-bg-tertiary rounded mb-2">
            <div style={{ width: `${playerProgress}%` }} className="h-full bg-brand-cyan rounded transition-[width]" />
          </div>

          <div className="flex items-center justify-between text-[12px] text-text-muted mb-1">
            <div>Opponent ({aiLevel})</div>
            <div>{aiProgress}%</div>
          </div>
          <div className="w-full h-4 bg-bg-tertiary rounded">
            <div style={{ width: `${aiProgress}%` }} className="h-full bg-green-500 rounded transition-[width]" />
          </div>
        </div>

        <div className="mb-2 whitespace-pre-wrap text-text-muted text-sm font-mono p-3 bg-bg-primary rounded">
          {content}
        </div>

        <textarea
          value={typed}
          onChange={(e) => handleTypedChange(e.target.value)}
          disabled={!started || playerProgress >= 100 || aiProgress >= 100}
          className="w-full p-3 rounded border border-border bg-bg-primary text-white min-h-[110px]"
          placeholder="Type the shown content to advance..."
        />
      </div>

      {result && (
        <div className="card p-4">
          <h3 className="font-bold">Result</h3>
          <p className="mt-2">
            {result.winner === "player"
              ? "You won the race."
              : result.winner === "ai"
                ? "Opponent won. Try again."
                : "Draw."}
          </p>
          <ul className="mt-3 text-sm space-y-1">
            <li><strong>Elapsed:</strong> {result.elapsedSeconds}s</li>
            <li><strong>Gross WPM:</strong> {result.grossWpm}</li>
            <li><strong>Net WPM:</strong> {result.netWpm}</li>
            <li><strong>Mistakes:</strong> {result.mistakes}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
