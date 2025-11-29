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
        // Obsidian Gold theme colors
        obsidian: "#000000",
        surface: "#18181b", // Zinc-900
        gold: "#f59e0b", // Amber-500
        "gold-dim": "#d97706", // Hover state
        "border-dark": "#27272a", // Zinc-800
      },
      // Additional customizations
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;