export type Role = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT';

export type EloTier =
  | 'IRON'
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'EMERALD'
  | 'DIAMOND'
  | 'MASTER'
  | 'GRANDMASTER'
  | 'CHALLENGER';

export interface ChampionPick {
  name: string;
  key: string;
  iconUrl: string;
}

export interface DuoProfile {
  id: string;
  realRiotId: string;       // e.g. "zicaneto#BR1" (only shown on Match)
  role: Role;
  eloDisplay: string;       // e.g. "Platina III"
  eloTier: EloTier;
  eloIconUrl: string;
  bio: string;              // e.g. "procuro pessoas para jogar e subir de elo, atual platina. chilling"
  vibes: string[];          // e.g. ["CHILL", "CLIMB", "TRYHARD"]
  hasMic: boolean;
  splashArtUrl: string;     // Any skin splash art chosen by player
  skinName: string;         // e.g. "Viego, o Rei Destruído"
  championPool: ChampionPick[]; // Top 3 champions
  discordTag: string;
  isOnline: boolean;
}

/**
 * Masks a Riot ID to protect player privacy prior to mutual match.
 * Example: "zicaneto#BR1" -> "zic----#b--"
 *
 * Uses a fixed number of dashes so the mask doesn't leak the nick length.
 * NOTE: this is display-only. Until Fase 5 the real ID still reaches the client;
 * the server must eventually send only the masked value before a match.
 */
export function maskRiotId(riotId: string): string {
  const [name, tag] = riotId.split('#');
  if (!name || !tag) return '???----#---';

  return `${name.slice(0, 3)}----#${tag.slice(0, 1)}--`.toLowerCase();
}
