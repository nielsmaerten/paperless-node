import { describe, expect, it } from 'vitest';
import { buildPath } from '../src/utils/url.js';

describe('buildPath', () => {
  it('replaces template params', () => {
    expect(buildPath('/api/documents/{id}/', { id: 42 })).toBe('/api/documents/42/');
  });

  it('encodes values', () => {
    expect(buildPath('/api/tags/{name}/', { name: 'foo/bar' })).toBe('/api/tags/foo%2Fbar/');
  });

  it('throws when params are missing', () => {
    expect(() => buildPath('/api/documents/{id}/')).toThrow('Missing path parameter: id');
  });
});
