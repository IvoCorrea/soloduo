import { describe, expect, it } from 'vitest';
import type { Profile } from '@/types';
import { canDuoRanked, ladderIndex, rankProfiles } from './discovery';

function make(id: string, over: Partial<Profile> = {}, lol: Partial<Profile['lol']> = {}): Profile {
  return {
    id,
    displayName: id,
    age: null,
    pronouns: '',
    region: '',
    languages: ['Português'],
    bio: '',
    photos: [{ id: 'p', url: 'x', focusX: 50, focusY: 50, status: 'approved' }],
    interests: [],
    commStyle: 'tanto-faz',
    schedule: ['noite'],
    intents: ['competitivo', 'casual', 'amizade'],
    discoverable: true,
    ...over,
    lol: {
      riotId: '',
      server: 'BR1',
      tier: 'GOLD',
      division: 'II',
      mainRole: 'ADC',
      secondaryRole: null,
      champions: [],
      modes: ['ranqueada'],
      mic: true,
      availableNow: false,
      ...lol,
    },
  };
}

const ctx = { excludedIds: new Set<string>() };

describe('ladder', () => {
  it('orders tiers and divisions', () => {
    expect(ladderIndex('IRON', 'IV')).toBe(0);
    expect(ladderIndex('GOLD', 'I')).toBeGreaterThan(ladderIndex('GOLD', 'IV'));
    expect(ladderIndex('MASTER', null)).toBeGreaterThan(ladderIndex('DIAMOND', 'I'));
  });

  it('applies duo rules', () => {
    const gold = make('a').lol;
    expect(canDuoRanked(gold, make('b', {}, { tier: 'PLATINUM' }).lol)).toBe(true);
    expect(canDuoRanked(gold, make('b', {}, { tier: 'EMERALD' }).lol)).toBe(false);
    const d1 = make('a', {}, { tier: 'DIAMOND', division: 'I' }).lol;
    expect(canDuoRanked(d1, make('b', {}, { tier: 'DIAMOND', division: 'III' }).lol)).toBe(true);
    expect(canDuoRanked(d1, make('b', {}, { tier: 'DIAMOND', division: 'IV' }).lol)).toBe(false);
  });
});

describe('rankProfiles', () => {
  const me = make('me');

  it('hides ineligible profiles', () => {
    const hidden = [
      make('blocked'),
      make('off', { discoverable: false }),
      make('nophoto', { photos: [] }),
      make('pending', { photos: [{ id: 'p', url: 'x', focusX: 50, focusY: 50, status: 'pending' }] }),
      make('nointent', { intents: ['amizade'] }),
      make('server', {}, { server: 'NA1' }),
      make('elo', {}, { tier: 'DIAMOND' }),
    ];
    const res = rankProfiles(me, hidden, 'competitivo', {}, { excludedIds: new Set(['blocked']) });
    expect(res).toEqual([]);
  });

  it('prefers complementary roles in competitive mode', () => {
    const sup = make('sup', {}, { mainRole: 'SUPPORT' });
    const adc = make('adc', {}, { mainRole: 'ADC' });
    const res = rankProfiles(me, [adc, sup], 'competitivo', {}, ctx);
    expect(res.map((r) => r.profile.id)).toEqual(['sup', 'adc']);
  });

  it('allows other servers for friendships and ranks shared interests', () => {
    const me2 = make('me', { interests: ['ARAM', 'Cosplay'] });
    const a = make('a', { interests: ['ARAM', 'Cosplay'] }, { server: 'NA1' });
    const b = make('b');
    expect(rankProfiles(me2, [b, a], 'amizade', {}, ctx)[0].profile.id).toBe('a');
  });

  it('applies filters', () => {
    const res = rankProfiles(me, [make('a', {}, { mic: false }), make('b')], 'casual', { micOnly: true }, ctx);
    expect(res.map((r) => r.profile.id)).toEqual(['b']);
  });
});
