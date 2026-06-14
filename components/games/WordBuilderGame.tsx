"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const WORD_SECONDS = 10;
const MAX_MISSES = 3;
const SESSION_OPTIONS = [30, 60, 120];
const WORDS = [
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
];

type EndReason = "time" | "misses" | "stopped";

type Puzzle = {
  target: string;
  scrambled: string;
};

type SessionResult = {
  reason: EndReason;
  score: number;
  solved: number;
  misses: number;
};

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function scramble(word: string) {
  if (word.length < 2) return word;

  for (let attempt = 0; attempt < 8; attempt++) {
    const letters = word.split("");
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    const scrambled = letters.join("");
    if (scrambled !== word) return scrambled;
  }

  return word.split("").reverse().join("");
}

function createPuzzle(): Puzzle {
  const target = pickWord();
  return {
    target,
    scrambled: scramble(target),
  };
}

export default function WordBuilderGame() {
  const [sessionDuration, setSessionDuration] = useState(60);
  const [started, setStarted] = useState(false);
  const [puzzle, setPuzzle] = useState(createPuzzle);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState(0);
  const [misses, setMisses] = useState(0);
  const [wordTimeLeft, setWordTimeLeft] = useState(WORD_SECONDS);
  const [totalTimeLeft, setTotalTimeLeft] = useState(sessionDuration);
  const [result, setResult] = useState<SessionResult | null>(null);

  const timerRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const scoreRef = useRef(0);
  const solvedRef = useRef(0);
  const missesRef = useRef(0);
  const wordTimeLeftRef = useRef(WORD_SECONDS);
  const totalTimeLeftRef = useRef(sessionDuration);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setNextPuzzle = useCallback(() => {
    setPuzzle(createPuzzle());
    setInput("");
    wordTimeLeftRef.current = WORD_SECONDS;
    setWordTimeLeft(WORD_SECONDS);
  }, []);

  const finishSession = useCallback((reason: EndReason) => {
    if (!startedRef.current) return;

    clearTimer();
    startedRef.current = false;
    setStarted(false);
    setInput("");
    setResult({
      reason,
      score: scoreRef.current,
      solved: solvedRef.current,
      misses: missesRef.current,
    });
  }, [clearTimer]);

  const registerMiss = useCallback(() => {
    const nextMisses = missesRef.current + 1;
    missesRef.current = nextMisses;
    setMisses(nextMisses);

    if (nextMisses >= MAX_MISSES) {
      finishSession("misses");
      return;
    }

    setNextPuzzle();
  }, [finishSession, setNextPuzzle]);

  useEffect(() => {
    totalTimeLeftRef.current = sessionDuration;
    if (!started) setTotalTimeLeft(sessionDuration);
  }, [sessionDuration, started]);

  useEffect(() => {
    if (!started) {
      clearTimer();
      return;
    }

    timerRef.current = window.setInterval(() => {
      const nextTotalTime = Math.max(0, totalTimeLeftRef.current - 1);
      totalTimeLeftRef.current = nextTotalTime;
      setTotalTimeLeft(nextTotalTime);

      if (nextTotalTime <= 0) {
        finishSession("time");
        return;
      }

      const nextWordTime = wordTimeLeftRef.current - 1;
      if (nextWordTime <= 0) {
        registerMiss();
      } else {
        wordTimeLeftRef.current = nextWordTime;
        setWordTimeLeft(nextWordTime);
      }
    }, 1000);

    return clearTimer;
  }, [started, finishSession, registerMiss, clearTimer]);

  const startGame = () => {
    clearTimer();

    startedRef.current = true;
    scoreRef.current = 0;
    solvedRef.current = 0;
    missesRef.current = 0;
    wordTimeLeftRef.current = WORD_SECONDS;
    totalTimeLeftRef.current = sessionDuration;

    setStarted(true);
    setPuzzle(createPuzzle());
    setInput("");
    setScore(0);
    setSolved(0);
    setMisses(0);
    setWordTimeLeft(WORD_SECONDS);
    setTotalTimeLeft(sessionDuration);
    setResult(null);
  };

  const stopGame = () => {
    finishSession("stopped");
  };

  const handleInputChange = (value: string) => {
    if (!startedRef.current) return;

    setInput(value);

    if (value.trim().toLowerCase() !== puzzle.target.toLowerCase()) return;

    const reward = 10 + wordTimeLeftRef.current;
    const nextScore = scoreRef.current + reward;
    const nextSolved = solvedRef.current + 1;

    scoreRef.current = nextScore;
    solvedRef.current = nextSolved;
    setScore(nextScore);
    setSolved(nextSolved);
    setNextPuzzle();
  };

  const resultText = result?.reason === "time"
    ? "Time is up."
    : result?.reason === "misses"
      ? "Three missed words ended the session."
      : "Session stopped.";

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <h2 className="text-xl font-bold mb-3">Word Builder</h2>
      <p className="text-text-muted mb-4">
        Unscramble each word before its timer runs out. Three misses end the session.
      </p>

      <div className="flex flex-wrap items-end gap-3 mb-4">
        <label className="text-sm text-text-muted">
          <span className="block mb-1">Session</span>
          <select
            value={sessionDuration}
            onChange={(e) => setSessionDuration(Number(e.target.value))}
            disabled={started}
            className="px-3 py-2 rounded border border-border bg-bg-tertiary text-text-primary"
          >
            {SESSION_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}s</option>
            ))}
          </select>
        </label>

        <button onClick={startGame} className="btn-primary">
          {result ? "Play Again" : "Start"}
        </button>
        <button onClick={stopGame} disabled={!started} className="btn-outline disabled:opacity-50">
          Stop
        </button>

        <div className="ml-auto text-sm text-text-muted">
          Score: {score} | Solved: {solved} | Misses: {misses}/{MAX_MISSES}
        </div>
      </div>

      <div className="card p-6 mb-4 text-center">
        <div className="mb-3 flex flex-wrap items-center justify-center gap-4 text-sm text-text-muted">
          <span>Total: {totalTimeLeft}s</span>
          <span>Word: {wordTimeLeft}s</span>
        </div>

        <div className="text-3xl font-mono mb-4 tracking-[0.18em]">{puzzle.scrambled}</div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <input
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={!started}
            className="px-3 py-2 rounded border border-border bg-bg-primary text-white"
            placeholder="Type the correct word"
          />
          <button type="button" onClick={registerMiss} disabled={!started} className="btn-outline disabled:opacity-50">
            Skip
          </button>
        </div>
      </div>

      {result && (
        <div className="card p-4">
          <h3 className="font-bold">Session Result</h3>
          <p className="mt-2">{resultText}</p>
          <ul className="mt-3 text-sm space-y-1">
            <li><strong>Score:</strong> {result.score}</li>
            <li><strong>Solved:</strong> {result.solved}</li>
            <li><strong>Misses:</strong> {result.misses}/{MAX_MISSES}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
