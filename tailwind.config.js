/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/static/ca-portal.html",
    "./app/static/agent-pwa.html",
    "./app/static/ca-portal.js",
    "./app/static/agent-pwa.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#00288e",
        "primary-container": "#1e40af",
        "on-primary": "#ffffff",
        secondary: "#006c4a",
        "secondary-container": "#82f5c1",
        tertiary: "#532a00",
        "tertiary-container": "#743d00",
        background: "#f8f9ff",
        surface: "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#444653",
        outline: "#757684",
        "outline-variant": "#c4c5d5",
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Hanken Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
