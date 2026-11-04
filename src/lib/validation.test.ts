import { describe, expect, it } from 'vitest';
import { ageFrom, basicsSchema, bioSchema, riotIdSchema } from './validation';

describe('validation', () => {
  it('computes age around birthdays', () => {
    const now = new Date('2026-10-30T12:00:00');
    expect(ageFrom('2008-10-30', now)).toBe(18);
    expect(ageFrom('2008-10-31', now)).toBe(17);
  });

  it('blocks minors', () => {
    const base = { displayName: 'Ivo', adultConfirmed: true as const };
    expect(basicsSchema.safeParse({ ...base, birthDate: '2000-01-01' }).success).toBe(true);
    expect(basicsSchema.safeParse({ ...base, birthDate: `${new Date().getFullYear() - 10}-01-01` }).success).toBe(false);
  });

  it('rejects html and links in bio but keeps emojis', () => {
    expect(bioSchema.safeParse('oi 🎮\nbora jogar').success).toBe(true);
    expect(bioSchema.safeParse('<script>x</script>').success).toBe(false);
    expect(bioSchema.safeParse('me acha em www.site.com').success).toBe(false);
  });

  it('checks riot id shape', () => {
    expect(riotIdSchema.safeParse('').success).toBe(true);
    expect(riotIdSchema.safeParse('Hasagi#BR1').success).toBe(true);
    expect(riotIdSchema.safeParse('semtag').success).toBe(false);
  });
});
