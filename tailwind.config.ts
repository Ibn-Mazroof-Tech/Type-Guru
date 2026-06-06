import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#060B14",
          secondary: "#0C1422",
          tertiary: "#0F1A2B",
          card: "#131E30",
        },
        brand: {
          cyan: "#00E5FF",
          gold: "#FFB800",
          green: "#00FF94",
          purple: "#C084FC",
          blue: "#60A5FA",
          red: "#FF4455",
          orange: "#FF8844",
        },
        text: {
          primary: "#DDE8F8",
          muted: "#58698A",
        },
        border: "rgba(0,229,255,0.11)",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["Space Mono", "monospace"],
        brand: ["Orbitron", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease both",
        "ring-pulse": "ringPulse 1.8s infinite",
        blink: "blink 0.7s infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        ringPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0,229,255,0.45)" },
          "70%": { boxShadow: "0 0 0 10px rgba(0,229,255,0)" },
        },
        blink: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.15" } },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
