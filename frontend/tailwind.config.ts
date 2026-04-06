import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          50: "#effcfb",
          100: "#d4f5f3",
          200: "#adebe7",
          300: "#80dfda",
          400: "#53d3cd",
          500: "#2bc4be",
          600: "#1ea8a3",
          700: "#188883",
          800: "#136c68",
          900: "#0e504d",
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
          50: "#fff4ec",
          100: "#ffe5d2",
          200: "#ffd0ae",
          300: "#ffb988",
          400: "#ffa465",
          500: "#ff914d",
          foreground: "hsl(var(--accent-foreground))",
        },
        neutral: {
          50: "#fffdf9",
          100: "#f9f6ef",
          200: "#f1ece2",
          300: "#e5ded1",
          400: "#b8b0a3",
          500: "#8f8779",
          600: "#6b655c",
          700: "#4f4a42",
          800: "#3a3630",
          900: "#2f2b26",
        },
        supporting: {
          sage: {
            50: "#f1f7f3",
            100: "#deede3",
            200: "#c2dccd",
            300: "#9ac4ac",
            400: "#72ac8a",
          },
          gold: {
            50: "#fff9eb",
            100: "#fff1cf",
            200: "#ffe3a3",
            300: "#ffd178",
            400: "#e7ba55",
          },
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  safelist: [
    { pattern: /bg-primary-(50|100|200|300|400|500|600|700|800|900)/, variants: ['hover', 'active', 'focus'] },
    { pattern: /shadow-(sm|md|lg|xl|2xl)/, variants: ['hover', 'active'] },
    { pattern: /translate-y-(0|px)/, variants: ['hover', 'active'] },
    { pattern: /-translate-y-(0\.5|1|px)/, variants: ['hover', 'active'] },
    { pattern: /scale-(90|95|100|105)/, variants: ['active', 'hover'] },
  ],
  plugins: [require("tailwindcss-animate")],
}
export default config
