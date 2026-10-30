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
  displayName: string;      // Apelido livre exibido no card, ex.: "Ivo"
  /**
   * Riot ID real, ex.: "zicaneto#BR1". Nunca aparece no card, só no match.
   * NOTE: até a Fase 5 ele ainda chega ao navegador nos dados mockados;
   * depois, o servidor só vai enviá-lo quando existir um match.
   */
  realRiotId: string;
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
 * Apelido exibido no card. É escolhido livremente pelo jogador
 * e não tem relação com o Riot ID (ex.: "Ivo").
 */
export const DISPLAY_NAME_MAX = 16;
