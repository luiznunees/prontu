import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        paper: "var(--color-paper)",
        accent: "var(--color-accent)",
        "accent-soft": "var(--color-accent-soft)",
        "prontu-blue": "var(--color-blue)",
        "prontu-yellow": "var(--color-yellow)",
        "prontu-green": "var(--color-green)",
        gray: {
          100: "var(--color-gray-100)",
          300: "var(--color-gray-300)",
          500: "var(--color-gray-500)",
          700: "var(--color-gray-700)",
        }
      },
      fontFamily: {
        display: ["var(--font-syne)"],
        body: ["var(--font-dm-sans)"],
        mono: ["var(--font-dm-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
