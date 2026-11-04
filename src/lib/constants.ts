import type { CommStyle, Division, EloTier, GameMode, Intent, Role, Server, TimeSlot } from '@/types';

export const APP_NAME = 'DuoMatch';
export const FREE_DAILY_LIKES = 20;
export const BIO_MAX = 500;
export const DISPLAY_NAME_MAX = 24;
export const PREMIUM_PRICE = 'R$ 4,90';
export const TRIAL_DAYS = 3;

export const ROLE_LABEL: Record<Role, string> = {
  TOP: 'Topo',
  JUNGLE: 'Selva',
  MID: 'Meio',
  ADC: 'Atirador',
  SUPPORT: 'Suporte',
};
export const ROLES = Object.keys(ROLE_LABEL) as Role[];

export const TIER_LABEL: Record<EloTier, string> = {
  IRON: 'Ferro',
  BRONZE: 'Bronze',
  SILVER: 'Prata',
  GOLD: 'Ouro',
  PLATINUM: 'Platina',
  EMERALD: 'Esmeralda',
  DIAMOND: 'Diamante',
  MASTER: 'Mestre',
  GRANDMASTER: 'Grão-Mestre',
  CHALLENGER: 'Desafiante',
};
export const TIERS = Object.keys(TIER_LABEL) as EloTier[];
export const DIVISIONS: Division[] = ['IV', 'III', 'II', 'I'];
export const APEX_TIERS: EloTier[] = ['MASTER', 'GRANDMASTER', 'CHALLENGER'];

export const SERVER_LABEL: Record<Server, string> = {
  BR1: 'Brasil',
  LAN: 'LAN',
  LAS: 'LAS',
  NA1: 'América do Norte',
  EUW1: 'Europa Oeste',
};
export const SERVERS = Object.keys(SERVER_LABEL) as Server[];

export const INTENT_INFO: Record<Intent, { label: string; short: string; description: string }> = {
  competitivo: {
    label: 'Competitivo',
    short: 'Subir de elo',
    description: 'Duo para ranqueada, com elo compatível e rotas que se completam.',
  },
  casual: {
    label: 'Casual',
    short: 'Jogar sem pressão',
    description: 'ARAM, Arena, normal. Companhia pra jogar e se divertir.',
  },
  amizade: {
    label: 'Amizades',
    short: 'Conhecer gente',
    description: 'Pessoas com interesses em comum, dentro e fora do jogo.',
  },
};
export const INTENTS = Object.keys(INTENT_INFO) as Intent[];

export const TIME_SLOT_LABEL: Record<TimeSlot, string> = {
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
  madrugada: 'Madrugada',
};
export const TIME_SLOTS = Object.keys(TIME_SLOT_LABEL) as TimeSlot[];

export const GAME_MODE_LABEL: Record<GameMode, string> = {
  ranqueada: 'Solo/Duo',
  flex: 'Flex',
  normal: 'Normal',
  aram: 'ARAM',
  arena: 'Arena',
};
export const GAME_MODES = Object.keys(GAME_MODE_LABEL) as GameMode[];

export const COMM_STYLE_LABEL: Record<CommStyle, string> = {
  call: 'Prefiro call',
  texto: 'Prefiro chat/pings',
  'tanto-faz': 'Tanto faz',
};

export const INTEREST_SUGGESTIONS = [
  'Jogar ranqueada',
  'ARAM',
  'Arena',
  'Jogar casualmente',
  'Fazer amizades',
  'Conversar no Discord',
  'Conhecer novos campeões',
  'Melhorar mecanicamente',
  'Participar de equipes',
  'Assistir campeonatos',
  'Cosplay',
  'Setup gamer',
  'Animes',
  'Música',
  'Pets',
];

export const LANGUAGE_SUGGESTIONS = ['Português', 'Espanhol', 'Inglês'];

export const CHAMPION_SUGGESTIONS = [
  'Ahri', 'Akali', 'Amumu', 'Ashe', 'Caitlyn', 'Darius', 'Diana', 'Ekko', 'Ezreal', 'Garen',
  'Graves', 'Irelia', 'Jhin', 'Jinx', 'Kaisa', 'Karma', 'Kayn', 'LeeSin', 'Leona', 'Lulu',
  'Lux', 'Malphite', 'MissFortune', 'Morgana', 'Nami', 'Nautilus', 'Orianna', 'Pyke', 'Riven', 'Sett',
  'Seraphine', 'Sylas', 'Thresh', 'Vayne', 'Vi', 'Viego', 'Yasuo', 'Yone', 'Yuumi', 'Zed',
];
