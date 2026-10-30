export const DDRAGON_VERSION = '14.20.1';

const ELO_CREST_BASE =
  'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests';

const crest = (tier: string) => `${ELO_CREST_BASE}/${tier}.svg`;

export const ELO_EMBLEMS: Record<string, string> = {
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

export const POPULAR_SKINS = [
  { champion: 'Viego', skinNum: 0, name: 'Viego Padrão' },
  { champion: 'Viego', skinNum: 1, name: 'Viego Feras Lunares' },
  { champion: 'Ahri', skinNum: 27, name: 'Ahri Florescer Espiritual' },
  { champion: 'Lucian', skinNum: 9, name: 'Lucian Velho Oeste' },
  { champion: 'LeeSin', skinNum: 11, name: 'Lee Sin Punho Divino' },
  { champion: 'Jinx', skinNum: 40, name: 'Jinx Arcane' },
  { champion: 'Aatrox', skinNum: 7, name: 'Aatrox Lua Sangrenta' },
  { champion: 'Kaisa', skinNum: 14, name: "K/DA ALL OUT Kai'Sa" },
  { champion: 'Yasuo', skinNum: 9, name: 'Yasuo Emissário da Escuridão' },
  { champion: 'Lulu', skinNum: 27, name: 'Lulu Embalos no Espaço' },
  { champion: 'Thresh', skinNum: 15, name: 'Thresh Florescer Espiritual' },
  { champion: 'Zed', skinNum: 10, name: 'PROJETO: Zed' },
];

export function getSplashArtUrl(champion: string, skinNum: number): string {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion}_${skinNum}.jpg`;
}

export function getChampionIconUrl(championKey: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${championKey}.png`;
}
