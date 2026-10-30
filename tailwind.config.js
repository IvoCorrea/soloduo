/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F1A20", // Ink Black
        foreground: "#F8FAFC",
        brand: {
          dark: "#0F1A20",     // Ink Black
          orange: "#FA9F42",   // Sandy Brown
          blue: "#80A1D4",     // Wisteria Blue
        },
        card: {
          DEFAULT: "#14232C",
          foreground: "#F8FAFC",
        },
        border: "rgba(255, 255, 255, 0.08)",
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
