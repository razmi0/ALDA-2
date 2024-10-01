/** @type {import('tailwindcss').Config} */
//
import twAnimate from "tailwindcss-animate";
//
//
export default {
  darkMode: ["selector"],
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
          // 400: "#a2c999",
          // 500: "#397c5b",
          600: "#1d3822",
        },
        pur: {
          400: "#d5d4ea",
          500: "#7b8ec3",
          600: "#f3d2ff", //#ba9bc5
        },
        fsky: {
          400: "#518fce",
          500: "#5d8dcf",
          600: "#5870B3",
          650: "#2f5d9d",
          700: "#004f9a",
        },
        map: {
          dark: "#0b0e16",
          darkblue: "#a4b1d6",
        },
        darkMode: {
          500: "#080808",
        },
        earth: {
          400: "#3d393d",
          500: "#282528",
          600: "#262123",
          700: "#1b171a",
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
  plugins: [
    twAnimate,
    ({ addUtilities }) => {
      const nUtilities = {
        ".vertical": {
          display: "flex",
          "flex-direction": "column",
        },
        ".vertical-reverse": {
          display: "flex",
          "flex-direction": "column-reverse",
        },
        ".horizontal": {
          display: "flex",
          "flex-direction": "row",
        },
        ".horizontal-reverse": {
          display: "flex",
          "flex-direction": "row-reverse",
        },
        ".center": {
          "justify-content": "center",
          "justify-items": "center",
          "align-items": "center",
        },
        ".full": {
          width: "100%",
          height: "100%",
        },
        ".absolute-align": {
          position: "absolute",
          inset: "0",
        },
        ".absolute-center": {
          position: "absolute",
          inset: "0",
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
        },
        ".shadcn-border": {
          "--tw-ring-offset-color": "#fff",
          border: "1px solid #e4e4e7",
          "border-radius": "0.375rem",
          "box-shadow": "0 0 0 1px #E5E7EB",
        },
      };
      addUtilities(nUtilities);
    },
  ],
};
