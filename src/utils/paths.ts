const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function path(url = ''): string {
  if (/^(?:https?:|mailto:|#)/.test(url)) return url;
  const clean = url.replace(/^\/+/, '');
  const rooted = `/${clean}`;
  if (base !== '/' && (rooted === base.slice(0, -1) || rooted.startsWith(base))) return rooted;
  return `${base}${clean}`.replace(/\/{2,}/g, '/');
}

export function postPath(id: string): string {
  return path(`blog/${id.replace(/\.(md|mdx)$/, '')}/`);
}

export function projectPath(slug: string): string {
  return path(`projects/${slug}/`);
}

export function absoluteUrl(url = ''): URL {
  return new URL(path(url), import.meta.env.SITE);
}
