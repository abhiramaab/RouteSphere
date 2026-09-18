/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f7f8fa',
          100: '#eef1f5',
          200: '#dde2ea',
          300: '#c3cbd8',
          400: '#98a4b7',
          500: '#6f7c93',
          600: '#4f5b71',
          700: '#3a4458',
          800: '#232b3b',
          900: '#141924',
        },
        brand: {
          50: '#eef4ff',
          100: '#dbe7ff',
          200: '#bed3ff',
          300: '#91b5ff',
          400: '#5c8dff',
          500: '#3569f0',
          600: '#214fdb',
          700: '#1a3fb8',
          800: '#1a3794',
          900: '#1b3275',
        },
        signal: {
          green: '#0f9d6e',
          amber: '#c47f17',
          red: '#d64545',
          slate: '#64748b',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 25, 36, 0.04), 0 1px 3px rgba(20, 25, 36, 0.06)',
        lift: '0 12px 28px -12px rgba(20, 25, 36, 0.18), 0 2px 6px rgba(20, 25, 36, 0.05)',
        pop: '0 24px 60px -20px rgba(20, 25, 36, 0.28)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'rise': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'pop-in': {
          from: { opacity: '0', transform: 'translateY(14px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'draw-line': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(53, 105, 240, 0.28)' },
          '70%': { boxShadow: '0 0 0 8px rgba(53, 105, 240, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(53, 105, 240, 0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'rise': 'rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-left': 'slide-in-left 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pop-in': 'pop-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
        'draw-line': 'draw-line 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },
    },
  },
  plugins: [],
}
