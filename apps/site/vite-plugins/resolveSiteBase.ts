/** GitHub Pages repo slug — project site lives at https://gopdfjs.github.io/gopdf-cli/ */
export const GH_PAGES_REPO = 'gopdf-cli';

/**
 * Vite `base` for the docs site.
 *
 * | Scenario                         | base           |
 * |----------------------------------|----------------|
 * | Local dev                        | `/`            |
 * | GH Pages + custom domain (CNAME) | `/`            |
 * | GH Pages project site (no CNAME) | `/gopdf-cli/`  |
 */
export function resolveSiteBase(): string {
  if (process.env.VITE_BASE) {
    return process.env.VITE_BASE;
  }

  const isGhPages = process.env.GITHUB_PAGES === 'true';
  const hasCustomDomain = process.env.CUSTOM_DOMAIN === 'true';

  if (isGhPages && !hasCustomDomain) {
    return `/${GH_PAGES_REPO}/`;
  }

  return '/';
}
