/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAF8",
        surface: "#FFFFFF",
        ink: "#1C1E1B",
        inkmuted: "#6B6F66",
        line: "#E4E1D8",
        primary: {
          DEFAULT: "#2D5C45",
          dark: "#1F4733",
          light: "#E8F0EA",
        },
        signal: {
          DEFAULT: "#B5562C",
          light: "#FAEAE1",
        },
        gold: {
          DEFAULT: "#9C7E2E",
          light: "#F6F0E0",
        },
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
