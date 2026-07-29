# Project detail pages

Every project in `src/data/projects.ts` automatically receives a page at `/projects/<slug>/`.

Each current project already has a Markdown file in this directory. Add long-form content below its frontmatter:

```yaml
---
project: ntu-rewind
---

## Overview

Write the public project record here.
```

The `project` value must match the project’s `slug` in `src/data/projects.ts`. Keep private implementation details, credentials, participant information, internal university material and unreleased challenge material out of these files.
