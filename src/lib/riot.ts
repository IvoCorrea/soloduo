import type { Division, EloTier } from '@/types';
import { TIER_LABEL } from './constants';

export const DDRAGON_VERSION = '14.20.1';

const ELO_CREST_BASE =
  'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests';

const crest = (tier: string) => `${ELO_CREST_BASE}/${tier}.svg`;

export const ELO_EMBLEMS: Record<EloTier, string> = {
  IRON: crest('iron'),
  BRONZE: crest('bronze'),
  SILVER: crest('silver'),
  GOLD: crest('gold'),
  PLATINUM: crest('platinum'),
  EMERALD: crest('emerald'),
  DIAMOND: crest('diamond'),
  MASTER: crest('master'),
  GRANDMASTER: crest('grandmaster'),
  CHALLENGER: crest('challenger'),
};

export function getSplashArtUrl(champion: string, skinNum: number): string {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion}_${skinNum}.jpg`;
}

/** Arte vertical (308x560), boa para cards em retrato. */
export function getLoadingArtUrl(champion: string, skinNum: number): string {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion}_${skinNum}.jpg`;
}

export function getChampionIconUrl(championKey: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${championKey}.png`;
}

export function formatElo(tier: EloTier, division: Division | null): string {
  return division ? `${TIER_LABEL[tier]} ${division}` : TIER_LABEL[tier];
}
