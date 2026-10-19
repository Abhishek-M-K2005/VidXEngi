/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#050811",
          card: "#090f1d",
          border: "#182642",
          neon: "#00f0ff",
          amber: "#ffb703",
          emerald: "#10b981",
          crimson: "#ff0055",
          purple: "#9d4edd",
          blue: "#3a86ff",
          gold: "#ffd166",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        chakra: ['"Chakra Petch"', 'sans-serif'],
        engineer: ['"Chakra Petch"', 'sans-serif'],
        orbitron: ['"Orbitron"', 'sans-serif'],
        mecha: ['"Orbitron"', '"Chakra Petch"', 'sans-serif'],
        anurati: ['"Anurati"', 'sans-serif'],
        electric: ['"Anurati"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'electric-glow': 'electricGlow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        electricGlow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 240, 255, 0.2), inset 0 0 10px rgba(0, 240, 255, 0.1)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 240, 255, 0.6), inset 0 0 15px rgba(0, 240, 255, 0.3)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
