import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effcfc",
          100: "#d4f4f4",
          200: "#aee9e9",
          300: "#7dd9d9",
          400: "#4cc4c4",
          500: "#26a8a8",
          600: "#0d7377",
          700: "#095b5e",
          800: "#064446",
          900: "#032e30",
        },
        accent: {
          DEFAULT: "#ff6b6b",
          50: "#fff5f5",
          100: "#ffe0e0",
          200: "#ffc2c2",
          300: "#ff9e9e",
          400: "#ff7b7b",
          500: "#ff6b6b",
          600: "#e84a4a",
          700: "#c43535",
          800: "#a02626",
          900: "#7c1a1a",
        },
        surface: {
          DEFAULT: "#ffffff",
          soft: "#f7f8fa",
          warm: "#fafafc",
          muted: "#f0f1f3",
        },
        ink: {
          DEFAULT: "#1d1d1f",
          muted: "#6a6a6a",
          light: "#9a9a9a",
        },
        savings: {
          DEFAULT: "#34a853",
          light: "#e6f4ea",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-hero": ["56px", { lineHeight: "1.1", letterSpacing: "-0.028em", fontWeight: "600" }],
        "display-h1": ["40px", { lineHeight: "1.15", letterSpacing: "-0.022em", fontWeight: "600" }],
        "display-h2": ["32px", { lineHeight: "1.25", letterSpacing: "-0.018em", fontWeight: "600" }],
        "display-h3": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["17px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-base": ["15px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      borderRadius: {
        pill: "9999px",
        card: "14px",
        button: "8px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover": "0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
        "float": "0 8px 24px 0 rgb(0 0 0 / 0.10)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "counter": "counter 2s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeInUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        counter: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
