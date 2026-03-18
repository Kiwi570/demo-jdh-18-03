import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rouge: {
          DEFAULT: "#C0392B",
          light: "#E04535",
          dark: "#9B2D22",
          soft: "#F5E8E6",
        },
        gold: {
          DEFAULT: "#C9A96E",
          light: "#DFC08A",
          dark: "#A8884A",
        },
        terracotta: {
          DEFAULT: "#1E1008",
          mid: "#321608",
          light: "#6B3A28",
          dark: "#1A0E09",
        },
        cream: {
          DEFAULT: "#F5F0E8",
          warm: "#EDE8DC",
          white: "#FAFAF7",
        },
        forest: {
          DEFAULT: "#2D4A3E",
          light: "#3D6454",
          dark: "#1a2e27",
        },
        stone: {
          DEFAULT: "#8B7355",
          light: "#A8906E",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"], // alias rétrocompat
      },
      spacing: {
        section: "8rem",
        "section-sm": "5rem",
        "nav": "80px",
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "expo-in": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "loader-bar": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "bounce-scroll": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "loader-bar": "loader-bar 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "bounce-scroll": "bounce-scroll 1.5s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-slow": "pulse-slow 2.8s ease-in-out infinite",
      },
      boxShadow: {
        rouge: "0 4px 24px rgba(192, 57, 43, 0.45)",
        gold: "0 0 30px rgba(201, 169, 110, 0.3)",
        card: "0 8px 40px rgba(30,16,8, 0.12)",
        "card-hover": "0 20px 60px rgba(30,16,8, 0.2)",
        nav: "0 4px 30px rgba(0, 0, 0, 0.3)",
      },
      zIndex: {
        cursor: "9999",
        loader: "9998",
        modal: "9996",
        nav: "40",
      },
      fontSize: {
        "2xs": ["0.75rem", { lineHeight: "1.1rem" }],
      },
      aspectRatio: {
        photo: "4/3",
        portrait: "3/4",
        cinema: "21/9",
      },
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  safelist: [
    "border-l-2",
    "border-l-forest-light",
    "border-l-terracotta-light",
    "border-l-gold",
    "border-l-gold-dark",
    "border-l-rouge",
    "border-l-rouge-light",
    "border-forest/30",
    "border-forest-light/30",
    "border-terracotta-light/30",
    "border-rouge/30",
    "border-rouge/40",
    "text-forest-light",
    "text-terracotta-light",
    "text-rouge",
    "text-rouge-light",
    "text-rouge/80",
    "text-gold-dark",
    "text-gold-light",
    "text-stone-light",
    "text-stone",
    "bg-rouge",
    "bg-rouge-light",
    "bg-gold-dark",
    "bg-stone",
  ],
  plugins: [],
};

export default config;
