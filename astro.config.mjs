// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE_URL } from './src/config/site-url.mjs';
import { isNoindexPath, resetNoindexRegistry } from './src/config/noindex-registry.mjs';

/**
 * Clear the noindex registry at the start of every build so a page that stopped
 * being thin does not stay excluded from the sitemap forever.
 */
resetNoindexRegistry();

export default defineConfig({
  site: SITE_URL,
  output: 'static',

  // PRD 5.1: one canonical shape for every URL, always with a trailing slash.
  trailingSlash: 'always',

  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  image: {
    // Deploy rule B: never let Astro fan out into an implicit srcset.
    // Every <Image> must pass explicit `widths` and `formats`.
    responsiveStyles: false,
  },

  integrations: [
    sitemap({
      entryLimit: 5000,
      // Read lazily: this callback runs after every page has rendered, which is
      // when `src/lib/seo/indexability.ts` has finished populating the registry.
      filter: (url) => {
        try {
          return !isNoindexPath(new URL(url).pathname);
        } catch {
          return true;
        }
      },
      changefreq: 'weekly',
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        if (pathname === '/') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        if (pathname.startsWith('/games/')) {
          return { ...item, priority: 0.9 };
        }
        if (pathname.startsWith('/c/')) {
          return { ...item, priority: 0.8, changefreq: 'daily' };
        }
        if (pathname.startsWith('/collections/')) {
          return { ...item, priority: 0.7 };
        }
        if (pathname === '/blog/') {
          // The blog index is a live content hub, not an archival listing.
          return { ...item, priority: 0.7, changefreq: 'weekly' };
        }
        if (pathname.startsWith('/blog/')) {
          // Individual posts carry the site's editorial value; weekly keeps the
          // sitemap honest about how often posts actually change.
          return { ...item, priority: 0.6, changefreq: 'weekly' };
        }
        if (pathname.startsWith('/t/')) {
          return { ...item, priority: 0.5 };
        }
        return { ...item, priority: 0.4, changefreq: 'monthly' };
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
