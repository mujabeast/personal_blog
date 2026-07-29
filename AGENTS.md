# Project rules

- Use current Astro and strict TypeScript conventions.
- Keep the website fully static and keep client-side JavaScript minimal.
- Preserve GitHub Pages user-site and project-site base-path compatibility. Route internal links through `src/utils/paths.ts`.
- Treat Markdown in `src/content/` as the source of truth for writing.
- Preserve GitBook compatibility and keep `.gitbook.yaml`, `src/content/README.md`, and `src/content/SUMMARY.md` valid.
- Do not fabricate personal facts, emotions, results, certifications, roles, dates, or technical achievements.
- Never publish secrets, private infrastructure, participant information, sponsor correspondence, internal university material, medical information, relationship details, challenge credentials, unreleased flags, or private repository content.
- Do not silently change publication dates, event dates, or the `/now` last-updated date.
- Keep post categories consistent with `src/content.config.ts`: `journey`, `writeups`, `learning`, `projects`, and `experiences`.
- Maintain semantic HTML, visible focus, keyboard navigation, colour contrast, reduced-motion support, and responsive behaviour.
- Do not add dependencies without a clear technical reason.
- Run `npm run check` and `npm run build` after meaningful changes.
- Update `README.md` whenever deployment, content, GitBook, or maintenance workflows change.
