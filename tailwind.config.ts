import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#f4e8d6",
        muted: "rgba(244, 232, 214, 0.68)",
        accent: "#c47a4a",
        "accent-bright": "#e0925c",
        research: "#6fc3d8",
        alert: "#e07a4a",
        danger: "#d45c4a",
        night: "#0d0f12",
      },
      fontFamily: {
        display: ["var(--font-display)", "Iowan Old Style", "Georgia", "serif"],
        body: ["var(--font-body)", "Avenir Next", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        glow: "0 10px 28px rgba(196, 122, 74, 0.28)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "topic-in": {
          "0%": { opacity: "0.65", transform: "translateY(10px) scale(0.97)" },
          "55%": { opacity: "1", transform: "translateY(-5px) scale(1.04)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "tick-flash": {
          from: { opacity: "0.5", transform: "translateY(6px)" },
          to: { opacity: "0.9", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
        "pulse-done": {
          "0%, 100%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.06)" },
        },
        "overlay-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        rise: "rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "rise-delay": "rise 1s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both",
        "topic-in": "topic-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        "tick-flash": "tick-flash 80ms linear",
        blink: "blink 0.7s ease-in-out infinite",
        "pulse-done": "pulse-done 0.8s ease",
        "overlay-in": "overlay-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
