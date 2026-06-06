"use client";
import { useState } from "react";

const KEY_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"],
];

const DEFAULT_SCORES: Record<string, number> = {
  Q:38, W:72, E:95, R:88, T:62, Y:55, U:74, I:90, O:92, P:68,
  A:94, S:87, D:81, F:48, G:43, H:65, J:32, K:70, L:85,
  Z:28, X:42, C:83, V:35, B:50, N:88, M:75,
};

const TIPS: Record<string, string> = {
  J: "Right index struggles with J. Drill: jar, joy, jump, just — 3 min daily.",
  Z: "Weakest key. Practice: zone, zero, zoom. Keep pinky relaxed and extended.",
  V: "Low accuracy. Relax wrist; drill: view, value, vast, very slowly.",
  F: "F anchor key needs work. Return to home row after every F stroke.",
  G: "G is tricky for index. Practice: go, give, grow transitions carefully.",
  B: "B needs left-index bridge. Drill: big, book, both with deliberate strokes.",
};

function getKeyColor(s: number): string {
  if (s >= 80) return "#00FF94";
  if (s >= 60) return "#FFB800";
  if (s >= 40) return "#FF8844";
  return "#FF4455";
}

interface Props {
  scores?: Record<string, number>;
}

export function KeyboardHeatmap({ scores = DEFAULT_SCORES }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-brand-gold text-sm">⌨️ Keyboard Accuracy Heatmap</h3>
        <span className="text-text-muted text-xs">Click any key for coaching tip</span>
      </div>

      {/* Keys */}
      <div className="flex flex-col items-center gap-2 mb-4">
        {KEY_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1.5"
            style={{ marginLeft: ri === 1 ? 14 : ri === 2 ? 28 : 0 }}>
            {row.map((k) => {
              const s   = scores[k] ?? 75;
              const clr = getKeyColor(s);
              const sel = selected === k;
              return (
                <button
                  key={k}
                  onClick={() => setSelected(sel ? null : k)}
                  className="w-10 h-10 rounded-lg flex flex-col items-center justify-center transition-all"
                  style={{
                    background:   sel ? clr : clr + "1E",
                    border:       `1px solid ${clr}${sel ? "CC" : "42"}`,
                    transform:    sel ? "scale(1.18)" : "scale(1)",
                  }}>
                  <span className="font-mono font-bold text-[11px]"
                    style={{ color: sel ? "#060B14" : clr }}>{k}</span>
                  <span className="text-[7px]"
                    style={{ color: sel ? "#060B14" : clr + "AA" }}>{s}%</span>
                </button>
              );
            })}
          </div>
        ))}
        {/* Space bar */}
        <div className="w-48 h-7 rounded-lg flex items-center justify-center text-xs text-text-muted"
          style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.18)" }}>
          SPACE — 96%
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mb-3">
        {[["#00FF94","80-100% Strong"],["#FFB800","60-79% Average"],["#FF8844","40-59% Weak"],["#FF4455","<40% Critical"]].map(([c,l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: c }} />
            <span className="text-text-muted text-[10.5px]">{l}</span>
          </div>
        ))}
      </div>

      {/* Tip */}
      {selected && (
        <div className="rounded-xl p-3 mt-1 border"
          style={{
            background:   getKeyColor(scores[selected] ?? 75) + "0A",
            borderColor:  getKeyColor(scores[selected] ?? 75) + "38",
          }}>
          <span className="font-bold text-sm mr-2"
            style={{ color: getKeyColor(scores[selected] ?? 75) }}>
            Key "{selected}" — {scores[selected] ?? 75}%
          </span>
          <span className="text-text-muted text-xs">
            {TIPS[selected] ?? `Practice words containing "${selected.toLowerCase()}" to improve speed and accuracy.`}
          </span>
        </div>
      )}
    </div>
  );
}
