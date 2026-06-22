/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: "#0F172A",
        sidebar: "#111827",
        card: "#1E293B",
        hover: "#334155",
        "border-card": "#374151",
        primary: "#6366F1",
        "primary-hover": "#4F46E5",
        destructive: "#DC2626",
        "destructive-hover": "#B91C1C",
      }
    },
  },
  plugins: [],
}
