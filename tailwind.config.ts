
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./styles/**/*.{ts,tsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        base: {
          900: "#0D0D0D",
          800: "#121212",
          700: "#181818",
          600: "#222222"
        },
        foil: {
          gold: "#FFD700",
          cyan: "#00E0FF",
          purple: "#9B30FF",
          red: "#FF3B3B"
        }
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 224, 255, 0.45)",
        "neon-purple": "0 0 20px rgba(155, 48, 255, 0.45)",
        "neon-red": "0 0 20px rgba(255, 59, 59, 0.45)",
        "foil-gold": "0 0 16px rgba(255, 215, 0, 0.35)"
      },
      backgroundImage: {
        "holo-gradient":
          "radial-gradient(100% 100% at 0% 0%, rgba(0,224,255,0.25) 0%, transparent 40%), radial-gradient(100% 100% at 100% 0%, rgba(155,48,255,0.25) 0%, transparent 45%), radial-gradient(100% 100% at 100% 100%, rgba(255,215,0,0.2) 0%, transparent 40%), radial-gradient(100% 100% at 0% 100%, rgba(255,59,59,0.2) 0%, transparent 50%)",
        "foil-noise":
          "repeating-linear-gradient( 45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)"
      },
      fontFamily: {
        ui: ["var(--font-inter)", "var(--font-roboto)", "system-ui", "sans-serif"],
        poster: ["var(--font-bebas)", "var(--font-oswald)", "Impact", "sans-serif"]
      },
      transitionTimingFunction: {
        "out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)"
      }
    }
  },
  plugins: []
} satisfies Config;
