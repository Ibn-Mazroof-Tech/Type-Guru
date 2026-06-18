"use client";
import React, { useEffect, useRef, useState } from "react";

type FallingWord = { id: string; text: string; top: number; left: number; speed: number };

const WORDS = [
  "type","quick","learn","speed","power","focus","skill","practice","master","fast","text","word","level","score","reach","build","train","flow","move","steady",
];

export default function FallingWordsGame() {
  const [started, setStarted] = useState(false);
  const [words, setWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [level, setLevel] = useState(1);
  const tickRef = useRef<number | null>(null);
  const spawnRef = useRef<number | null>(null);

  const maxWords = 8; // cap simultaneous words

  // level controls spawn interval (ms) and speed multiplier
  const levelConfig = (lvl: number) => {
    return {
      spawnInterval: Math.max(400, 1200 - lvl * 80),
      speedBase: 1 + lvl * 0.2,
    };
  };

  useEffect(() => {
    if (!started) return;

    tickRef.current = window.setInterval(() => {
      setWords((ws) => {
        const cfg = levelConfig(level);
        const updated = ws.map(w => ({ ...w, top: w.top + w.speed * cfg.speedBase }));
        const alive = updated.filter(w => w.top < 100);
        const fallen = updated.length - alive.length;
        if (fallen > 0) setLives((l) => Math.max(0, l - fallen));
        return alive;
      });
    }, 200);

    spawnRef.current = window.setInterval(() => {
      setWords((ws) => {
        if (ws.length >= maxWords) return ws;
        const w: FallingWord = {
          id: `${Date.now()}-${Math.random()}`,
          text: WORDS[Math.floor(Math.random() * WORDS.length)],
          top: 0,
          left: 4 + Math.random() * 84,
          speed: 1.5 + Math.random() * 2,
        };
        return [...ws, w];
      });
    }, levelConfig(level).spawnInterval);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [started, level]);

  useEffect(() => {
    if (lives <= 0) setStarted(false);
  }, [lives]);

  useEffect(() => {
    // level up every 200 points, cap at 10
    const next = Math.min(10, Math.floor(score / 200) + 1);
    setLevel(next);
  }, [score]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    const trimmed = e.target.value.trim();
    const matchedIndex = words.findIndex(w => w.text === trimmed);
    if (matchedIndex >= 0) {
      const matched = words[matchedIndex];
      setScore(s => s + Math.round(10 + (100 - matched.top) / 5));
      setWords(ws => ws.filter(w => w.id !== matched.id));
      setInput("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => { setStarted(true); setWords([]); setScore(0); setLives(5); setLevel(1); }} className="btn-primary">Start</button>
        <button onClick={() => { setStarted(false); }} className="btn-outline">Stop</button>
        <div className="ml-auto text-sm text-text-muted">Score: {score} · Lives: {lives} · Level: {level}</div>
      </div>

      <div className="relative h-64 bg-bg-secondary rounded border border-border mb-3 overflow-hidden">
        {words.map((w) => (
          <div key={w.id} style={{ position: 'absolute', left: `${w.left}%`, top: `${w.top}%`, transition: 'top 0.18s linear' }} className="px-3 py-1 rounded bg-brand-cyan text-slate-900 text-sm">
            {w.text}
          </div>
        ))}
      </div>

      <input value={input} onChange={handleInput} disabled={!started || lives <= 0} className="w-full p-3 rounded border border-border bg-bg-primary text-white" placeholder="Type falling words here..." />

      {lives <= 0 && (
        <div className="card p-4 mt-4">
          <h3 className="font-bold">Game Over</h3>
          <p className="mt-2">Your score: {score}</p>
          <button onClick={() => { setStarted(true); setLives(5); setScore(0); setWords([]); setLevel(1); }} className="btn-primary mt-3">Play Again</button>
        </div>
      )}
    </div>
  );
}
