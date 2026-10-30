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
 */
export function maskRiotId(riotId: string): string {
  const parts = riotId.split('#');
  if (parts.length !== 2) return 'player#----';

  const [name, tag] = parts;
  
  const maskedName = name.length <= 3 
    ? name + '---'
    : name.slice(0, 3) + '-'.repeat(Math.max(3, name.length - 3));

  const maskedTag = tag.length <= 1
    ? tag + '--'
    : tag.slice(0, 1) + '-'.repeat(Math.max(2, tag.length - 1));

  return `${maskedName}#${maskedTag}`.toLowerCase();
}
