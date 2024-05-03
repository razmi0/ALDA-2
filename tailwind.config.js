/** @type {import('tailwindcss').Config} */
//
import twAnimate from "tailwindcss-animate";
//
//
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        gr: {
          400: "#a2c999",
          500: "#397c5b",
          600: "#1d3822",
        },
        pur: {
          400: "#d5d4ea",
          500: "#7b8ec3",
          600: "#f3d2ff", //#ba9bc5
        },
        def: {
          dark: "#0b0e16",
        },
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
  plugins: [twAnimate],
};
