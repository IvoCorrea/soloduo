import { describe, expect, it } from 'vitest';
import { sniffImageType } from './photos';

const bytes = (...v: number[]) => new Uint8Array(v);
const str = (s: string) => Array.from(s).map((c) => c.charCodeAt(0));

describe('sniffImageType', () => {
  it('detects real formats', () => {
    expect(sniffImageType(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe('image/jpeg');
    expect(sniffImageType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBe('image/png');
    expect(sniffImageType(bytes(...str('RIFF'), 0, 0, 0, 0, ...str('WEBP')))).toBe('image/webp');
  });

  it('rejects disguised files', () => {
    expect(sniffImageType(bytes(...str('<svg onload')))).toBeNull();
    expect(sniffImageType(bytes(...str('GIF89a'), 0, 0))).toBeNull();
    expect(sniffImageType(bytes())).toBeNull();
  });
});
