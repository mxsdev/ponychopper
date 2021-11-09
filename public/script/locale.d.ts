export declare type Season = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export declare type Character = "ts" | "aj" | "rd" | "ra" | "fs" | "pp";
export declare type Song = "Intro" | '1' | '2';
declare type SongLocale = {
    [index in Song]: {
        name: string;
        season: Season;
    };
};
declare type CharacterLocale = {
    [index in Character]: string;
};
export declare const songLocale: SongLocale;
export declare const listSeasons: () => Season[];
export declare const listSongs: () => {
    key: Song;
    name: string;
}[];
export declare const characterLocale: CharacterLocale;
export declare const listCharacters: () => {
    key: Character;
    name: string;
}[];
export {};
