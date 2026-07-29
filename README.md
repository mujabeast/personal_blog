# MYI — cybersecurity notes and projects

A static cybersecurity blog and project archive by Mujahid Y.I, covering systems and security study, CTF development, hardware work, technical education, and community projects.

The public site is intentionally writing-first: no trackers, external font requests, database, authentication, CMS, backend or client framework.

## Technology

- Astro 7 with strict TypeScript
- Astro content collections for validated Markdown and MDX
- GitHub Flavored Markdown and Shiki syntax highlighting
- Small, framework-free browser scripts for theme, navigation, archive filtering and code-copy controls
- `@astrojs/sitemap` and `@astrojs/rss`
- GitHub Pages deployment through GitHub Actions
- GitBook Git Sync from the same `src/content/` Markdown files

## Prerequisites

- Node.js 22 or later
- npm 10 or later
- Git

## Local development

```bash
npm install
npm run dev
```

Astro prints the local URL, normally `http://localhost:4321`.

Useful commands:

```bash
npm run check     # Astro diagnostics and strict TypeScript checks
npm run build     # static production build in dist/
npm run preview   # serve the production build locally
npm test          # check, then build
```

## Repository map

```text
.github/workflows/deploy.yml  GitHub Pages workflow
public/                       Static icons and social preview assets
src/components/               Reusable Astro UI components
src/content/                  Markdown source shared by Astro and GitBook
src/data/                     Editable interests, projects, timeline and navigation data
src/layouts/                  Base, page and article layouts
src/pages/                    Static routes, archives, RSS and search index
src/styles/global.css         Design tokens, typography and responsive system
src/utils/                    Paths, dates and post helpers
src/content.config.ts         Typed post and page schemas
src/config.ts                 Identity, optional public social links and labels
.gitbook.yaml                 GitBook content-root configuration
AGENTS.md                     Durable rules for future Codex sessions
```

## Creating content

Create posts under a category-oriented folder in `src/content/posts/`. The folder is organisational; the validated `category` field controls the archive.

```yaml
---
title: A precise article title
description: A plain-language summary under 220 characters.
publishedDate: 2026-07-29
updatedDate: 2026-08-01 # optional
category: learning
tags:
  - linux
  - reverse-engineering
graphTopics:
  - systems
featured: false
draft: true
series: Linux internals # optional
seriesOrder: 1 # optional
coverImage: /images/example.webp # optional
canonicalUrl: https://example.com/original # optional
---
```

Supported categories are:

- `journey`
- `writeups`
- `learning`
- `projects`
- `experiences`

Tags should be lowercase URL-safe slugs, such as `web-security` or `challenge-creation`. Dynamic category and tag pages are generated during the build. Reading time is derived automatically from the Markdown body.

### Maintaining the homepage interest graph

The homepage graph is generated at build time. Do not edit SVG nodes or links by hand.

To add a blog post to a topic, add one or more `graphTopics` values to its frontmatter:

```yaml
graphTopics:
  - iot-hardware
```

When the post has `draft: false`, the next production build creates a branch from **IoT & hardware** to that post. Draft branches appear during local development but are excluded from the live site.

To add a project branch, set `graphTopics` on its entry in `src/data/projects.ts`:

```ts
{
  number: 'P-05',
  title: 'Example IoT project',
  // ...
  graphTopics: ['iot-hardware']
}
```

Projects link to their numbered anchor on `/projects/`. A project is public data, so only add a graph topic when its existing project summary is safe to publish.

Content pages in `src/content/pages/` also accept `graphTopics`, but the page must already have a matching route under `src/pages/`. A page called `research.md`, for example, needs a working `/research/` route before it should be added to the graph.

Available graph topic IDs are:

- `systems`
- `reverse-engineering`
- `web-api-security`
- `ctf-development`
- `iot-hardware`
- `technical-education`

The labels and IDs for these topics live in `src/data/interests.ts`. Add a new item there if the graph needs a new top-level topic; its initial radial position is calculated automatically. An entry may use multiple IDs, but use that sparingly because it will appear as a branch under every selected topic.

After updating graph content:

1. Run `npm run check` to validate every topic ID.
2. Run `npm run dev` and select the affected topic on the homepage.
3. Confirm the branch label and destination.
4. Run `npm run build` before publishing.

The browser script only handles movement, topic expansion and reset. All graph content remains static, typed build output; there is no graph database or client-side content fetch.

### Draft behaviour

Set `draft: true` while working. Drafts appear in local development with a visible draft marker, but they are excluded from production article routes, archives, tags, categories, RSS, sitemap discovery and the generated search index.

Do not use a future date as a substitute for `draft: true`.

### Markdown and MDX

Ordinary writing should use Markdown. MDX is available when an article genuinely needs a component such as `src/components/Callout.astro`.

Fenced code blocks receive syntax highlighting. Article pages add copy and line-wrap controls with a small browser script. Prefer a language identifier:

````markdown
```bash
readelf -h ./sample
```
````

Keep commands, expected output, explanation, assumptions and ethical boundaries visibly distinct.

### GitBook navigation

When adding or publishing an article, update `src/content/SUMMARY.md` if it should appear in the GitBook table of contents. Do not copy the article into another folder.

## Updating editable sections

- Homepage current focus: `src/data/focus.ts`
- Projects and status labels: `src/data/projects.ts`
- Homepage/journey timeline: `src/data/timeline.ts`
- Main navigation: `src/data/navigation.ts`
- `/now` content and `lastUpdated`: `src/content/pages/now.md`
- Public social/profile links: `src/config.ts`

Do not change the `/now` date unless the page was actually reviewed.

## GitHub Pages configuration

The Astro configuration reads the `GITHUB_REPOSITORY` environment variable automatically during GitHub Actions.

- For a user site named `<username>.github.io`, Astro builds with `/` as the base and `https://<username>.github.io` as the site URL.
- For any other repository, Astro builds with `/<repository>/` as the base and `https://<username>.github.io` as the site origin.
- Internal navigation, RSS, social images and canonical URLs use centralized base-aware helpers.

### Initial GitHub setup

1. Create the GitHub repository and push this project to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Open **Actions** and allow the `Deploy Astro site to GitHub Pages` workflow to finish.
5. If Actions are restricted, open **Settings → Actions → General** and allow actions from GitHub and verified creators.
6. Keep **Workflow permissions** at the repository default; `deploy.yml` declares the scoped `contents: read`, `pages: write`, and `id-token: write` permissions it needs.

The workflow runs on every push to `main` and can also be started manually. It installs with `npm ci`, runs `npm run check`, builds, uploads `dist/`, and deploys through the official Pages actions.

### Custom domain

No custom domain is configured in this repository because one was not supplied.

To add one:

1. Create `public/CNAME` containing only the hostname, for example `blog.example.com`.
2. Add the repository variable `CUSTOM_DOMAIN` under **Settings → Secrets and variables → Actions → Variables**.
3. Update the workflow build step to expose it:

   ```yaml
   env:
     CUSTOM_DOMAIN: ${{ vars.CUSTOM_DOMAIN }}
   ```

4. In **Settings → Pages → Custom domain**, enter the same hostname.
5. For an apex domain, add the current GitHub Pages `A`/`AAAA` records documented by GitHub. For a subdomain, add a `CNAME` to `<username>.github.io`.
6. Wait for DNS verification, then enable **Enforce HTTPS**.

Do not guess DNS values from this README; use GitHub’s current Pages custom-domain documentation when configuring DNS.

## GitBook Git Sync

The repository remains the source of truth.

Use these GitBook settings:

- Provider: **GitHub**
- Repository: the repository containing this project
- Branch: **main**
- Project directory / root: leave at the repository root; `.gitbook.yaml` sets `root: ./src/content/`
- Monorepo path, if GitBook asks explicitly: `/`
- Content root shown after configuration: `src/content/`
- Initial sync direction: **GitHub → GitBook**

Before the first sync:

1. Commit and push all local Markdown.
2. Confirm `src/content/README.md`, `src/content/SUMMARY.md` and `.gitbook.yaml` are present on `main`.
3. If the GitBook space already has valuable content, export or duplicate it first.
4. Choose the option that imports repository content into GitBook. Do **not** choose an initial GitBook-to-GitHub overwrite.
5. Review the first sync commit or preview before allowing bidirectional editing.

After initialisation, edits made in GitBook may generate commits in the repository. Pull those commits before making parallel local edits to reduce conflicts.

GitBook may display the YAML frontmatter above articles. Keep it because Astro uses it for validation and archives.

## SEO and static outputs

The build creates:

- Unique page titles and descriptions
- Canonical, Open Graph and Twitter card metadata
- Person, WebSite, BlogPosting and Breadcrumb structured data
- `sitemap-index.xml`
- `rss.xml`
- `robots.txt`
- `search-index.json`
- Custom `404.html`

`public/og-default.svg` is the default social preview. Replace it only with a similarly sized public-safe image. `public/images/missing-image.svg` is available as a deliberate fallback when a content image is unavailable.

## Identity and deployment values

The public GitHub, LinkedIn and contact-email values are maintained in `src/config.ts`. The GitHub repository owner and repository name are established automatically during the Actions build.

The only optional deployment value not currently configured is a custom domain. Follow the process above if one is added later.

If a public security email is added, include a short responsible-disclosure note and publish only an address intended for public contact.

## Privacy review

Never publish:

- API keys, passwords, tokens, sessions or `.env` files
- Private IP addresses, exploitable network diagrams or device credentials
- Unreleased flags, challenge solutions or private repositories
- Participant data, internal university documents or sponsor correspondence
- Medical information, relationship details or precise personal location

The project `.gitignore` excludes `.env` files, but that is not a substitute for reviewing staged changes.

## Pre-publication checklist

- [ ] Confirm the GitHub, LinkedIn and public email values in `src/config.ts` are still current
- [ ] Confirm the repository name and intended Pages URL
- [ ] Run `npm test`
- [ ] Run `npm run preview` and check desktop and mobile widths
- [ ] Test keyboard navigation, the menu, Escape handling and the theme toggle
- [ ] Confirm light and dark contrast
- [ ] Search the repository for secrets, private addresses, participant data and unreleased challenge material
- [ ] Confirm every published article has accurate dates and `draft: false`
- [ ] Confirm `/now` is accurate and update its date only if reviewed
- [ ] Validate external links
- [ ] Enable GitHub Pages with **Source: GitHub Actions**
- [ ] Start GitBook sync in the **GitHub → GitBook** direction
- [ ] Add `public/CNAME` only if a custom domain is actually configured
