import { describe, expect, it } from 'vitest';
import { joinSitePath } from './sitePaths';

describe('joinSitePath', () => {
  it('returns root for home in dev', () => {
    expect(joinSitePath('/', '/')).toBe('/');
    expect(joinSitePath('/', '/commands')).toBe('/commands');
  });

  it('prefixes routes with GitHub Pages base', () => {
    expect(joinSitePath('/gopdf-cli/', '/')).toBe('/gopdf-cli/');
    expect(joinSitePath('/gopdf-cli/', '/commands')).toBe('/gopdf-cli/commands');
    expect(joinSitePath('/gopdf-cli/', '/docs/guide/getting-started')).toBe(
      '/gopdf-cli/docs/guide/getting-started',
    );
  });
});
