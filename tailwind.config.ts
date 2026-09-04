import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F0F3FA",
          100: "#DBE2F3",
          200: "#B7C4E6",
          300: "#8C9DC9",
          400: "#5A6FA8",
          800: "#101B3F",
          900: "#0A1230",
          950: "#060A1D",
        },
        accent: {
          400: "#5B8DEF",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
