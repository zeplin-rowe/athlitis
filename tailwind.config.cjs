/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/pages/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f7fdf2",
          100: "#ecfbe8",
          200: "#d4f6c6",
          300: "#b9ef9f",
          400: "#8fe36a",
          500: "#59c02a", // primary green
          600: "#3f8b1e",
          700: "#2f5f15",
        },
        accent: {
          50: "#fff9ec",
          100: "#fff2d4",
          200: "#ffe4a6",
          300: "#ffd277",
          400: "#ffc042",
          500: "#f4b200", // yellow accent
        },
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "hero-pulse": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 600ms ease-out both",
        "hero-pulse": "hero-pulse 8s ease-in-out infinite",
      },
      boxShadow: {
        "soft-lg": "0 10px 30px rgba(20, 20, 20, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
