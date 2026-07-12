import { afterEach, describe, expect, it } from 'vitest';
import {
  configurePressBase,
  getPressBase,
  pressAsset,
  pressDocMarkdownUrl,
  resetPressBase,
} from '@wsxjs/wsx-press/client/paths';

describe('wsx-press configurePressBase', () => {
  afterEach(() => {
    resetPressBase();
  });

  it('prefixes press asset URLs for GitHub Pages subpath', () => {
    configurePressBase('/gopdf-cli/');
    expect(getPressBase()).toBe('/gopdf-cli/');
    expect(pressAsset('docs-meta.json')).toBe('/gopdf-cli/.wsx-press/docs-meta.json');
    expect(pressDocMarkdownUrl('guide/mcp')).toBe('/gopdf-cli/docs/guide/mcp.md');
  });

  it('defaults to root in dev', () => {
    configurePressBase('/');
    expect(pressAsset('docs-meta.json')).toBe('/.wsx-press/docs-meta.json');
    expect(pressDocMarkdownUrl('guide/mcp')).toBe('/docs/guide/mcp.md');
  });
});
