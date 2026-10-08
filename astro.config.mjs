import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://casaruralsierradeltietar.com',
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  env: {
    schema: {
      KEYSTATIC_USER: envField.string({ context: 'server', access: 'secret', optional: true }),
      KEYSTATIC_PASS: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/keystatic') &&
        !page.includes('/aviso-legal') &&
        !page.includes('/privacidad') &&
        !page.includes('/cookies') &&
        !page.includes('/seguimiento-emails'),
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
