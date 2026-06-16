/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        night: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#081122",
        },
        dream: {
          purple: "#a78bfa",
          pink: "#f9a8d4",
          blue: "#93c5fd",
          green: "#86efac",
          yellow: "#fde68a",
          orange: "#fdba74",
        },
      },
      fontFamily: {
        display: ['"Nunito"', '"Quicksand"', '-apple-system', 'sans-serif'],
        body: ['"Nunito"', '"Noto Sans SC"', '-apple-system', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'breathe-fast': 'breathe 2.5s ease-in-out infinite',
        'breathe-slow': 'breathe 6s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'scroll-highlight': 'scrollHighlight 0.3s ease-out',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1) translateY(0)' },
          '50%': { transform: 'scale(1.03) translateY(-2px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        scrollHighlight: {
          '0%': { backgroundColor: 'rgba(167, 139, 250, 0.1)' },
          '100%': { backgroundColor: 'rgba(167, 139, 250, 0.25)' },
        },
      },
      boxShadow: {
        'glow': '0 0 40px rgba(167, 139, 250, 0.15)',
        'glow-strong': '0 0 60px rgba(167, 139, 250, 0.3)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.15)',
        'inner-glow': 'inset 0 0 20px rgba(167, 139, 250, 0.1)',
      },
      backgroundImage: {
        'night-gradient': 'linear-gradient(135deg, #081122 0%, #0f172a 50%, #1e1b4b 100%)',
        'dream-gradient': 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(249, 168, 212, 0.1) 100%)',
      },
    },
  },
  plugins: [],
};
