import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0faf9",
          100: "#d4f4f4",
          200: "#aee9e9",
          300: "#7dd9d9",
          400: "#4cc4c4",
          500: "#26a8a8",
          600: "#0d7377",
          700: "#095b5e",
          800: "#064446",
          900: "#032e30",
          950: "#021c1e",
        },
        accent: {
          DEFAULT: "#ff8a5b",
          50: "#fff5ef",
          100: "#ffe6d9",
          200: "#ffc7ac",
          300: "#ffa279",
          400: "#ff8a5b",
          500: "#f56d33",
          600: "#df5520",
          700: "#b8401a",
          800: "#94331c",
          900: "#782c1b",
        },
        sand: {
          DEFAULT: "#f4ece1",
          50: "#fdfaf6",
          100: "#f7efe4",
          200: "#ecdcc7",
          300: "#ddc4a4",
        },
        surface: {
          DEFAULT: "#ffffff",
          soft: "#f6f8f9",
          warm: "#fbf9f6",
          muted: "#eef1f2",
        },
        ink: {
          DEFAULT: "#0f1724",
          muted: "#5b6472",
          light: "#9aa3b2",
        },
        savings: {
          DEFAULT: "#1f9d57",
          hover: "#15753e",
          light: "#e7f6ed",
        },
        whatsapp: {
          DEFAULT: "#22c55e",
          hover: "#16a34a",
          light: "#dcfce6",
        },
        rating: {
          DEFAULT: "#fbbf24",
          light: "#fffbeb",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-hero": ["56px", { lineHeight: "1.05", letterSpacing: "-0.032em", fontWeight: "600" }],
        "display-h1": ["40px", { lineHeight: "1.1", letterSpacing: "-0.024em", fontWeight: "600" }],
        "display-h2": ["32px", { lineHeight: "1.18", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-h3": ["24px", { lineHeight: "1.25", letterSpacing: "-0.012em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.7", fontWeight: "400" }],
        "body-base": ["16px", { lineHeight: "1.7", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.6", fontWeight: "400" }],
      },
      borderRadius: {
        pill: "9999px",
        card: "18px",
        button: "12px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 36 / 0.04), 0 1px 3px -1px rgb(15 23 36 / 0.05)",
        "card-hover": "0 12px 32px -8px rgb(15 23 36 / 0.12), 0 4px 8px -4px rgb(15 23 36 / 0.06)",
        "float": "0 20px 48px -12px rgb(15 23 36 / 0.18)",
        "glow": "0 0 0 1px rgb(13 115 119 / 0.08), 0 18px 40px -12px rgb(13 115 119 / 0.22)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "gradient-pan": "gradientPan 14s ease infinite",
        "float-slow": "floatSlow 7s ease-in-out infinite",
        "marquee": "marquee 32s linear infinite",
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
          "0%": { transform: "translateY(36px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        gradientPan: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
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
