import type { Config } from "tailwindcss";

// Brand palette lives here — adjust these values to re-theme the whole site.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#02060f",
          900: "#040b1a",
          850: "#071226",
          800: "#0a1930",
          700: "#11253f",
          600: "#1a3352",
          500: "#26456e",
        },
        ocean: {
          200: "#bce4fb",
          300: "#7dd0fa",
          400: "#3fb6f2",
          500: "#1793dc",
          600: "#0b73b3",
          700: "#0a5a8c",
        },
        mist: {
          50: "#f7f9fc",
          100: "#eef2f7",
          200: "#dbe3ee",
          300: "#b9c6d6",
          400: "#8797ac",
          500: "#64748b",
        },
        hazard: {
          orange: "#f97316",
          red: "#ef4444",
          reddeep: "#dc2626",
          amber: "#f59e0b",
          yellow: "#eab308",
          green: "#16a34a",
          blue: "#2563eb",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(60% 60% at 50% 0%, rgba(23,147,220,0.16) 0%, rgba(4,11,26,0) 70%)",
      },
      boxShadow: {
        premium: "0 20px 60px -20px rgba(2, 6, 15, 0.45)",
        "premium-lg": "0 30px 90px -25px rgba(2, 6, 15, 0.55)",
        glow: "0 0 0 1px rgba(63,182,242,0.15), 0 8px 30px -8px rgba(23,147,220,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
      maxWidth: {
        "8xl": "90rem",
      },
    },
  },
  plugins: [],
};

export default config;
