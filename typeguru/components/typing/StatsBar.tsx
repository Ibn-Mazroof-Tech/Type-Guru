"use client";

interface StatProps { value: number | string; label: string; color: string; max?: number; }

function Donut({ value, label, color, max = 100 }: StatProps) {
  const num  = typeof value === "string" ? parseInt(value) : value;
  const r    = 24;
  const circ = 2 * Math.PI * r;
  const pct  = Math.min(num / max, 1);

  return (
    <div className="text-center py-3 px-2 bg-bg-tertiary rounded-xl border border-border">
      <div className="relative inline-block w-14 h-14">
        <svg width={56} height={56} viewBox="0 0 56 56" className="rotate-[-90deg]">
          <circle cx={28} cy={28} r={r} fill="none" stroke="#18243A" strokeWidth={5} />
          <circle cx={28} cy={28} r={r} fill="none" stroke={color} strokeWidth={5}
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.4s ease" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold"
          style={{ color }}>
          {value}
        </div>
      </div>
      <div className="text-[9px] text-text-muted mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
}

interface StatsBarProps {
  wpm:      number;
  accuracy: number;
  time:     number;
  errors:   number;
}

export function StatsBar({ wpm, accuracy, time, errors }: StatsBarProps) {
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      <Donut value={wpm}      label="WPM"      color="#00E5FF" max={150} />
      <Donut value={accuracy} label="Accuracy" color="#00FF94" max={100} />
      <Donut value={time}     label="Time"     color="#FFB800" max={60}  />
      <Donut value={errors}   label="Errors"   color="#FF4455" max={20}  />
    </div>
  );
}
