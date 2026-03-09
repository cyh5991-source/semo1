/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1B2559",
        "navy-light": "#2D3A6E",
        accent: "#3B6AFF",
        "accent-soft": "rgba(59,106,255,0.08)",
      },
      fontFamily: {
        display: ["Outfit", "Pretendard", "sans-serif"],
        body: ["Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [],
};
