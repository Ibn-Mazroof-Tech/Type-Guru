"use client";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

export const MODES = [
  { id: "general",    emoji: "⚡", label: "General Speed",   sub: "QWERTY · Timed Test",      color: "#00E5FF", pro: false },
  { id: "government", emoji: "🏛️", label: "Govt. Exam Prep", sub: "SSC · RRB · CPCT · HC",    color: "#FFB800", pro: false },
  { id: "data",       emoji: "📊", label: "Data Entry",      sub: "Numbers · Codes · Forms",  color: "#60A5FA", pro: false },
  { id: "coding",     emoji: "💻", label: "Code Typing",     sub: "Python · JS · SQL",        color: "#00FF94", pro: true  },
  { id: "arabic",     emoji: "🕌", label: "Arabic / Urdu",   sub: "Script · Quran Practice",  color: "#C084FC", pro: true  },
] as const;

export type ModeId = typeof MODES[number]["id"];

interface Props {
  selected:  ModeId;
  onSelect:  (id: ModeId) => void;
  onUpgrade: () => void;
  isPro:     boolean;
}

export function ModeSelector({ selected, onSelect, onUpgrade, isPro }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {MODES.map((m) => {
        const locked   = m.pro && !isPro;
        const isActive = selected === m.id;
        return (
          <button
            key={m.id}
            onClick={() => locked ? onUpgrade() : onSelect(m.id)}
            style={{
              borderColor: isActive ? m.color + "55" : "rgba(0,229,255,0.11)",
              background:  isActive ? m.color + "15" : "#0F1A2B",
              color:       isActive ? m.color : "#58698A",
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-semibold border transition-all hover:opacity-90">
            <span>{m.emoji}</span>
            <span>{m.label}</span>
            {locked && <Lock size={10} className="opacity-60" />}
            {m.pro && (
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full border ml-0.5"
                style={{ background: m.color + "18", borderColor: m.color + "35", color: m.color }}>
                PRO
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
