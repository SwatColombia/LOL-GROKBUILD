export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  tags: string[];           // roles: Assassin, Fighter, Mage, Marksman, Support, Tank
  info: ChampionInfo;
  image: ChampionImage;
  version?: string;
}

export interface ChampionInfo {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

export interface ChampionImage {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ChampionDetail extends Champion {
  lore: string;
  allytips: string[];
  enemytips: string[];
  spells: Spell[];
  passive: Passive;
  skins?: Skin[];
}

export interface Spell {
  id: string;
  name: string;
  description: string;
  tooltip: string;
  cooldown: number[];
  cost: number[];
  costType: string;
  image: ChampionImage;
}

export interface Passive {
  name: string;
  description: string;
  image: ChampionImage;
}

export interface Skin {
  id: string;
  num: number;
  name: string;
  chromas: boolean;
}

export interface ChampionsResponse {
  type: string;
  version: string;
  data: { [key: string]: any };
}
