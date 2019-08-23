export class PokemonJSON {
  id: number;
  name: PokemonName;
  type: string[];
  base: PokemonBase;
}

export class PokemonName {
    english: string;
    japanese: string;
    chinese: string;
}

export class PokemonBase {
    HP: number;
    Attack: number;
    Defense: number;
    'Sp. Attack': number;
    'Sp. Defense': number;
    Speed: number;
}
