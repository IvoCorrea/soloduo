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

export type Division = 'I' | 'II' | 'III' | 'IV';
export type Server = 'BR1' | 'LAN' | 'LAS' | 'NA1' | 'EUW1';
export type Intent = 'competitivo' | 'casual' | 'amizade';
export type TimeSlot = 'manha' | 'tarde' | 'noite' | 'madrugada';
export type GameMode = 'ranqueada' | 'flex' | 'normal' | 'aram' | 'arena';
export type CommStyle = 'call' | 'texto' | 'tanto-faz';

/**
 * 'local' = processada no navegador e nunca enviada (demonstração).
 * Os demais estados são os do pipeline real de moderação (Fase 2).
 */
export type PhotoStatus = 'local' | 'pending' | 'approved' | 'rejected' | 'review_required';

export interface ProfilePhoto {
  id: string;
  url: string;
  /** Imagem usada se `url` falhar (fotos de demonstração ainda não geradas). */
  fallbackUrl?: string;
  /** Enquadramento em % (object-position). */
  focusX: number;
  focusY: number;
  status: PhotoStatus;
}

export interface LolProfile {
  /** Declarado pelo usuário, nunca verificado. Só aparece depois do match. */
  riotId: string;
  server: Server;
  tier: EloTier;
  division: Division | null; // null para Mestre+
  mainRole: Role;
  secondaryRole: Role | null;
  champions: string[]; // chaves do Data Dragon, ex.: "LeeSin"
  modes: GameMode[];
  mic: boolean;
  availableNow: boolean;
}

export interface Profile {
  id: string;
  displayName: string;
  age: number | null; // null quando o usuário esconde a idade
  pronouns: string;
  region: string;
  languages: string[];
  bio: string;
  photos: ProfilePhoto[];
  interests: string[];
  commStyle: CommStyle;
  schedule: TimeSlot[];
  intents: Intent[];
  lol: LolProfile;
  discoverable: boolean;
  discordTag?: string;
}

/** Perfil do próprio usuário: guarda dados que nunca são exibidos a terceiros. */
export interface MyProfile extends Profile {
  email: string;
  birthDate: string; // yyyy-mm-dd, nunca exibida
  showAge: boolean;
}

export interface DemoProfile extends Profile {
  /** Simula a curtida recíproca até existir backend. */
  likesYou: boolean;
}

export interface ChatMessage {
  id: string;
  from: 'me' | 'them';
  text: string;
  at: number;
}
