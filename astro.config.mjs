import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const [githubOwner = '', repository = ''] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const customDomain = process.env.CUSTOM_DOMAIN?.trim();
const explicitSite = process.env.SITE_URL?.trim();
const isUserSite = repository === `${githubOwner}.github.io`;
const site = customDomain
  ? `https://${customDomain}`
  : explicitSite
    ? explicitSite
    : githubOwner
      ? `https://${githubOwner}.github.io`
      : 'http://localhost:4321';
const base = customDomain || isUserSite || !repository ? '/' : `/${repository}`;

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true
    }
  },
  vite: {
    build: { cssMinify: true }
  }
});
