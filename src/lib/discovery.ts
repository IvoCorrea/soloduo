import type { Division, EloTier, Intent, Profile, Role, TimeSlot } from '@/types';
import { APEX_TIERS, DIVISIONS, TIERS } from './constants';

export interface DiscoveryFilters {
  role?: Role | null;
  // Premium (validar no servidor quando houver backend):
  minTier?: EloTier | null;
  maxTier?: EloTier | null;
  champion?: string | null;
  micOnly?: boolean;
  availableNowOnly?: boolean;
  schedule?: TimeSlot | null;
}

export interface DiscoveryContext {
  excludedIds: ReadonlySet<string>; // bloqueados + já avaliados
}

export interface RankedProfile<P extends Profile = Profile> {
  profile: P;
  score: number;
  reasons: string[];
}

/** Posição na escada: Ferro IV = 0 … Diamante I = 27, Mestre+ = 28+. */
export function ladderIndex(tier: EloTier, division: Division | null): number {
  const t = TIERS.indexOf(tier);
  if (APEX_TIERS.includes(tier)) return 28 + (t - TIERS.indexOf('MASTER'));
  return t * 4 + DIVISIONS.indexOf(division ?? 'IV');
}

/**
 * shortcut: aproximação das regras de duo da Solo/Duo (até 1 tier de diferença; de Diamante
 * para cima, no máximo 2 divisões). Conferir com as regras atuais da Riot antes do lançamento.
 */
export function canDuoRanked(a: Profile['lol'], b: Profile['lol']): boolean {
  const high = (l: Profile['lol']) => l.tier === 'DIAMOND' || APEX_TIERS.includes(l.tier);
  if (high(a) || high(b)) {
    return Math.abs(ladderIndex(a.tier, a.division) - ladderIndex(b.tier, b.division)) <= 2;
  }
  return Math.abs(TIERS.indexOf(a.tier) - TIERS.indexOf(b.tier)) <= 1;
}

const COMPLEMENTARY: Array<[Role, Role]> = [
  ['ADC', 'SUPPORT'],
  ['MID', 'JUNGLE'],
  ['TOP', 'JUNGLE'],
];

export function rolesComplement(a: Role, b: Role): boolean {
  return COMPLEMENTARY.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

const overlap = <T,>(a: readonly T[], b: readonly T[]) => a.filter((x) => b.includes(x));

function isEligible(me: Profile, other: Profile, mode: Intent, ctx: DiscoveryContext): boolean {
  if (other.id === me.id || ctx.excludedIds.has(other.id)) return false;
  if (!other.discoverable) return false;
  if (!other.photos.some((p) => p.status === 'approved')) return false;
  // Reciprocidade: a outra pessoa também precisa buscar este modo.
  if (!other.intents.includes(mode)) return false;
  if (mode === 'amizade') return true;
  if (other.lol.server !== me.lol.server) return false;
  if (mode === 'competitivo') return canDuoRanked(me.lol, other.lol);
  return true;
}

function passesFilters(other: Profile, f: DiscoveryFilters): boolean {
  const idx = TIERS.indexOf(other.lol.tier);
  if (f.role && other.lol.mainRole !== f.role && other.lol.secondaryRole !== f.role) return false;
  if (f.minTier && idx < TIERS.indexOf(f.minTier)) return false;
  if (f.maxTier && idx > TIERS.indexOf(f.maxTier)) return false;
  if (f.champion && !other.lol.champions.includes(f.champion)) return false;
  if (f.micOnly && !other.lol.mic) return false;
  if (f.availableNowOnly && !other.lol.availableNow) return false;
  if (f.schedule && !other.schedule.includes(f.schedule)) return false;
  return true;
}

/**
 * Pontuação só com dados declarados de jogo e preferências.
 * Nunca usa fotos, aparência ou atributos sensíveis.
 */
export function scoreProfile(me: Profile, other: Profile, mode: Intent): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  const sharedSlots = overlap(me.schedule, other.schedule);
  const sharedInterests = overlap(me.interests, other.interests);
  const sharedModes = overlap(me.lol.modes, other.lol.modes);

  if (sharedSlots.length) {
    score += 10 * sharedSlots.length;
    reasons.push('Horários em comum');
  }

  if (mode === 'competitivo') {
    const gap = Math.abs(ladderIndex(me.lol.tier, me.lol.division) - ladderIndex(other.lol.tier, other.lol.division));
    score += Math.max(0, 40 - gap * 5);
    if (gap <= 2) reasons.push('Elo parecido');
    if (rolesComplement(me.lol.mainRole, other.lol.mainRole)) {
      score += 35;
      reasons.push('Rotas que se completam');
    } else if (me.lol.mainRole === other.lol.mainRole) {
      score -= 15;
    }
    if (other.lol.modes.includes('ranqueada')) score += 10;
    if (me.lol.mic && other.lol.mic) score += 5;
  }

  if (mode === 'casual') {
    score += 15 * sharedModes.length;
    if (sharedModes.length) reasons.push('Curtem os mesmos modos');
    if (other.lol.availableNow) {
      score += 20;
      reasons.push('Disponível agora');
    }
    score += 5 * sharedInterests.length;
  }

  if (mode === 'amizade') {
    score += 12 * sharedInterests.length;
    if (sharedInterests.length) reasons.push(`${sharedInterests.length} interesse(s) em comum`);
    const langs = overlap(me.languages, other.languages);
    score += langs.length ? 15 : -30;
    if (me.commStyle === other.commStyle || other.commStyle === 'tanto-faz') score += 8;
    if (me.lol.server === other.lol.server) score += 5;
  }

  return { score, reasons };
}

export function rankProfiles<P extends Profile>(
  me: Profile,
  candidates: readonly P[],
  mode: Intent,
  filters: DiscoveryFilters,
  ctx: DiscoveryContext,
): RankedProfile<P>[] {
  return candidates
    .filter((p) => isEligible(me, p, mode, ctx) && passesFilters(p, filters))
    .map((profile) => ({ profile, ...scoreProfile(me, profile, mode) }))
    .sort((a, b) => b.score - a.score);
}
