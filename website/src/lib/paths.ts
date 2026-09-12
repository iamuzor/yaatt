export function path(href: string): string {
  const base = import.meta.env.BASE_URL;
  const normalized = href.replace(/^\//, "");
  return `${base}${normalized}`;
}
