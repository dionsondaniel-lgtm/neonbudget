/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#020617', // slate-950
        surface: 'rgba(255, 255, 255, 0.05)',
        'neon-blue': '#22d3ee', // cyan-400
        'neon-pink': '#d946ef', // fuchsia-500
        'neon-green': '#4ade80', // green-400
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(34, 211, 238, 0.4)',
        'neon-pink': '0 0 20px rgba(217, 70, 239, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: [],
}