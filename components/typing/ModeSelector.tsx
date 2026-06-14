"use client";

export const MODES = [
  { id: "general",    emoji: "⚡", label: "General Speed",   sub: "QWERTY · Timed Test",      color: "#00E5FF" },
  { id: "government", emoji: "🏛️", label: "Govt. Exam Prep", sub: "SSC · RRB · CPCT · HC",    color: "#FFB800" },
  { id: "data",       emoji: "📊", label: "Data Entry",      sub: "Numbers · Codes · Forms",  color: "#60A5FA" },
  { id: "coding",     emoji: "💻", label: "Code Typing",     sub: "Python · JS · SQL",        color: "#00FF94" },
  { id: "arabic",     emoji: "🕌", label: "Arabic / Urdu",   sub: "Script · Quran Practice",  color: "#C084FC" },
  { id: "race",       emoji: "🏁", label: "Race Mode",       sub: "Speed race against AI",   color: "#FF7A00" },
  { id: "falling",    emoji: "🍂", label: "Falling Words",   sub: "Type fast before words drop", color: "#8B5CF6" },
  { id: "word-builder", emoji: "🧩", label: "Word Builder",   sub: "Unscramble and type",       color: "#3B82F6" },
] as const;

export type ModeId = typeof MODES[number]["id"];

interface Props {
  selected:  ModeId;
  onSelect:  (id: ModeId) => void;
}

export function ModeSelector({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {MODES.map((m) => {
        const isActive = selected === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            style={{
              borderColor: isActive ? m.color + "55" : "rgba(0,229,255,0.11)",
              background:  isActive ? m.color + "15" : "#0F1A2B",
              color:       isActive ? m.color : "#58698A",
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-semibold border transition-all hover:opacity-90">
            <span>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
