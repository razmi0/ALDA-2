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
        map: {
          dark: "#0b0e16",
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
      addUtilities({
        ".vertical": {
          "@apply flex flex-col": {},
        },
        ".vertical-reverse": {
          "@apply flex flex-col-reverse": {},
        },
        ".horizontal": {
          "@apply flex": {},
        },
        ".horizontal-reverse": {
          "@apply  flex flex-row-reverse": {},
        },
        ".center": {
          "@apply justify-center items-center": {},
        },
        ".full": {
          "@apply w-full h-full": {},
        },
        ".absolute-align": {
          "@apply absolute inset-0": {},
        },
        ".absolute-center": {
          "@apply absolute inset-0 flex justify-center items-center": {},
        },
      });
    },
  ],
};

// @layer base {
//   .vertical {
//     @apply flex flex-col;

//     &.reverse {
//       @apply flex-col-reverse;
//     }
//   }

//   .horizontal {
//     @apply flex;

//     &.reverse {
//       @apply flex-row-reverse;
//     }
//   }

//   .center {
//     @apply justify-center items-center;
//   }

//   .between {
//     @apply justify-between;
//   }

//   .full {
//     @apply w-full h-full;
//   }

//   .absolute-align {
//     @apply absolute inset-0;
//   }

//   .absolute-center {
//     @apply absolute inset-0 flex justify-center items-center;
//   }
// }
