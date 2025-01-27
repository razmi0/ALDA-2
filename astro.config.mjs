import { defineConfig } from "astro/config";
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
    redirects: {
        "/": "/maintenance",
        "/activités": "/maintenance",
        "/contact": "/maintenance",
        "/faq": "/maintenance",
        "/nous": "/maintenance",
    },
    integrations: [
        react(),
        tailwind({
            applyBaseStyles: false,
        }),
    ],

    adapter: vercel(),
});
