import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          200: "#bce0ff",
          300: "#8eccff",
          400: "#53b0ff",
          500: "#2e8eff",
          600: "#1a6cf5",
          700: "#1a5276",
          800: "#1a3a5e",
          900: "#0f2a44",
        },
        teal: {
          50: "#effaf5",
          100: "#d7f4e8",
          200: "#b0e9d2",
          300: "#7ad7b4",
          400: "#2ecc71",
          500: "#2e86ab",
          600: "#1a6b8a",
          700: "#155470",
          800: "#13455b",
          900: "#123a4d",
        },
        ayurveda: {
          DEFAULT: "#27ae60",
          light: "#2ecc71",
          dark: "#1e8449",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
