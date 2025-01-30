import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

import sitemap from "@astrojs/sitemap";

/**
 * redirections to maintenance page if true;
 */
const OFFLINE_PROD = import.meta.env.PROD && true;

// https://astro.build/config

const maintenancyRedirections = {
    "/": "/maintenance",
    "/contact": "/maintenance",
    "/activites": "/maintenance",
    "/faq": "/maintenance",
    "/nous": "/maintenance",
};

export default defineConfig({
    site: "https://alabordarbre.fr",
    // redirects: OFFLINE_PROD ? maintenancyRedirections : {},
    integrations: [
        react(),
        tailwind({
            applyBaseStyles: false,
        }),
        sitemap({
            /**
             * Check if the page is not crawlable
             * @param {`https://alabordarbre.fr/${string}/`} page
             * @returns {boolean}
             */
            filter: (page) => {
                const forbiddenPaths = ["/honey", "/maintenance"];
                const url = new URL(page);
                const crawlable = !forbiddenPaths.some((path) => url.pathname.startsWith(path));
                console.log("[Generating sitemap] ", page, crawlable ? "crawlable" : "not crawlable");
                return crawlable;
            },
        }),
    ],

    adapter: vercel(),
});
