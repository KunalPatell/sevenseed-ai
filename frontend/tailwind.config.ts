import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "../../../packages/ui-core/src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        background: "#030712",
        surface: "#0b1329",
        navy: {
          DEFAULT: "#0a0f1f",
          light: "#0f1730",
          deep: "#070b16",
        },
        electric: {
          DEFAULT: "#3b82f6",
          bright: "#38bdf8",
          glow: "#60a5fa",
        },
        emerald: {
          glow: "#10b981",
        },
        muted: "#8b95a7",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.18), transparent 60%)",
        "electric-gradient":
          "linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #818cf8 100%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(59,130,246,0.45)",
        emerald: "0 0 40px -10px rgba(16,185,129,0.45)",
        card: "0 8px 40px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%, -40%) scale(1)",
          },
        },
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "rotate(215deg) translateX(-500px)", opacity: "0" },
        },
        "border-beam": {
          "100%": {
            offsetDistance: "100%",
          },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        aurora: "aurora 60s linear infinite",
        "meteor-effect": "meteor 5s linear infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
