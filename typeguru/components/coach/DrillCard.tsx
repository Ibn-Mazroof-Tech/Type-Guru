"use client";

const DRILLS = [
  { title: "J-Key Destroyer",  desc: "15 focused words using J",   dur: "5 min",  color: "#FF4455",  icon: "🎯" },
  { title: "Z-Pinky Sprint",   desc: "Pinky finger coordination",  dur: "3 min",  color: "#FF8844",  icon: "⚡" },
  { title: "Number Row Drill", desc: "1–9 numeric key mastery",    dur: "7 min",  color: "#FFB800",  icon: "🔢" },
  { title: "AI Mixed Set",     desc: "Weakness-targeting drill",   dur: "10 min", color: "#C084FC",  icon: "🤖" },
];

export function DrillCards() {
  return (
    <div className="card p-5">
      <h3 className="font-bold text-sm mb-4">🎯 Today&apos;s Personalized Drills</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DRILLS.map((d) => (
          <div key={d.title}
            className="bg-bg-tertiary border border-border rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-0.5"
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = d.color + "40"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.11)"; }}>
            <div className="text-xl mb-2">{d.icon}</div>
            <div className="font-bold text-xs mb-1" style={{ color: d.color }}>{d.title}</div>
            <div className="text-text-muted text-xs mb-3">{d.desc}</div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-[10px]">⏱ {d.dur}</span>
              <button className="text-[10px] font-bold px-2 py-1 rounded-md border transition-all hover:opacity-80"
                style={{ background: d.color + "16", borderColor: d.color + "30", color: d.color }}>
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
