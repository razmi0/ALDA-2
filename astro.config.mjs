import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

/**
 * redirections to maintenance page if true;
 */
const OFFLINE_PROD = import.meta.env.PROD && true;

// https://astro.build/config

const maintenancyRedirections = {
    "/": "/maintenance",
    "/contact": "/maintenance",
    "/activités": "/maintenance",
    "/faq": "/maintenance",
    "/nous": "/maintenance",
};

export default defineConfig({
    redirects: OFFLINE_PROD ? maintenancyRedirections : {},
    integrations: [
        react(),
        tailwind({
            applyBaseStyles: false,
        }),
    ],

    adapter: vercel(),
});
