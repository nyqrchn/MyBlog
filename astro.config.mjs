import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL ?? 'https://example.com';

export default defineConfig({
  site,
  integrations: [mdx(), react(), sitemap()],
});
