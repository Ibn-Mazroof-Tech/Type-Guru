"use client";

import React from "react";

type Feature = {
  icon: string;
  title: string;
  color: string;
  desc: string;
};

export default function HomeFeatures({ features }: { features: Feature[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((f) => (
        <div
          key={f.title}
          className="card p-5 transition-all duration-300 hover:-translate-y-1 cursor-default"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = f.color + "38";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,229,255,0.11)";
          }}
        >
          <div className="text-3xl mb-3">{f.icon}</div>
          <h3 className="font-bold text-[15px] mb-2" style={{ color: f.color }}>
            {f.title}
          </h3>
          <p className="text-text-muted text-[13px] leading-[1.7]">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
