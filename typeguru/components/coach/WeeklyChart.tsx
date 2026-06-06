"use client";

interface Props {
  data?: number[];
}

const DAYS = ["S","M","T","W","T","F","S"];

export function WeeklyChart({ data = [45, 52, 49, 61, 68, 72, 78] }: Props) {
  const max    = Math.max(...data, 1);
  const today  = data[data.length - 1];
  const prev   = data[0];
  const change = today - prev;

  return (
    <div className="card p-5">
      <h3 className="font-bold text-brand-cyan text-sm mb-4">📈 Weekly WPM Progress</h3>
      <div className="flex items-end gap-2 h-24 mb-2">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-sm transition-all"
              style={{
                height:     `${(v / max) * 100}%`,
                background: i === data.length - 1
                  ? "linear-gradient(to top, #00E5FF, #0099FF)"
                  : "linear-gradient(to top, rgba(0,229,255,0.5), rgba(0,229,255,0.2))",
              }}
            />
            <span className="text-[9px] text-text-muted">{DAYS[i]}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-5 mt-2">
        <div>
          <span className="font-mono font-bold text-xl text-brand-cyan">{today}</span>
          <span className="text-text-muted text-xs ml-1">WPM today</span>
        </div>
        <div>
          <span className="font-mono font-bold text-xl"
            style={{ color: change >= 0 ? "#00FF94" : "#FF4455" }}>
            {change >= 0 ? "+" : ""}{change}
          </span>
          <span className="text-text-muted text-xs ml-1">this week</span>
        </div>
      </div>
    </div>
  );
}
