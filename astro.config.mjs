import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";

/**
 * redirections to maintenance page if true;
 */
const OFFLINE_PROD = import.meta.env.PROD && false;

// https://astro.build/config
const robotConfig = {
    forbiddenPaths: ["/honey", "/maintenance"],
    sitemapsUrl: ["https://alabordarbre.fr/sitemap-index.xml", "https://alabordarbre.fr/sitemap-0.xml"],
    policy: [
        {
            userAgent: "*",
            allow: "/",
            disallow: ["/honey", "/maintenance"],
        },
    ],
};
const redirections = {
    offline: {
        "/": "/maintenance",
        "/contact": "/maintenance",
        "/activites": "/maintenance",
        "/faq": "/maintenance",
        "/nous": "/maintenance",
        "/honey": "/maintenance",
    },
    online: {
        "/maintenance": "/",
        "/honey": "/",
    },
};

export default defineConfig({
    site: "https://alabordarbre.fr",
    redirects: OFFLINE_PROD ? redirections.offline : redirections.online,
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
                const url = new URL(page);
                const crawlable = !robotConfig.forbiddenPaths.some((path) => url.pathname.startsWith(path));
                console.log("[Generating sitemap] ", page, crawlable ? "crawlable" : "not crawlable");
                return crawlable;
            },
        }),
        robotsTxt({
            sitemap: robotConfig.sitemapsUrl,
            policy: robotConfig.policy,
        }),
    ],

    adapter: vercel(),
});
