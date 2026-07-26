/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          400: '#38bdf8',
          500: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        slate: {
          850: '#111827',
          950: '#090d16'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(56, 189, 248, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
