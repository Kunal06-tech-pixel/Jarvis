/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        dark: {
          base: "#0A0D14",
          surface: "#10141E",
          card: "#121723",
          elevated: "#181E2E",
          pill: "#1B2232",
          border: "#1F2637",
          muted: "#758195",
        },
        electric: {
          blue: "#2563EB",
          lightBlue: "#3B82F6",
          cyan: "#38BDF8",
          glow: "#00E5FF",
        },
        apple: {
          blue: "#0071E3",
          indigo: "#5856D6",
          purple: "#AF52DE",
          pink: "#FF2D55",
          teal: "#5AC8FA",
          cyan: "#32D74B",
          yellow: "#FFD60A",
          orange: "#FF9F0A",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      animation: {
        'halo-spin': 'halo-spin 8s linear infinite',
        'halo-pulse': 'halo-pulse 3s ease-in-out infinite',
        'wave-flow': 'wave-flow 3s ease-in-out infinite alternate',
        'mic-pulse': 'mic-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'halo-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'halo-pulse': {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 35px rgba(37, 99, 235, 0.8))' },
        },
        'wave-flow': {
          '0%': { transform: 'scaleY(0.6) scaleX(0.98)', opacity: '0.6' },
          '50%': { transform: 'scaleY(1.1) scaleX(1.02)', opacity: '0.9' },
          '100%': { transform: 'scaleY(0.7) scaleX(1)', opacity: '0.7' },
        },
        'mic-pulse': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(37, 99, 235, 0.5)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 25px 8px rgba(37, 99, 235, 0.3)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
