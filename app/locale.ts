export type Season = "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"

export type Character = "ts"|"aj"|"rd"|"ra"|"fs"|"pp"

export type Song = "Intro"|'1'|'2'

type SongLocale = {
    [index in Song]: {
        name: string,
        season: Season
    }
}

type CharacterLocale = {
    [index in Character]: string
}

export const songLocale: SongLocale = ({
    'Intro': {
        name: "Intro",
        season: "1"
    },
    '1': {
        name: "Winter Wrap Up",
        season: "1"
    },
    '2': {
        name: "At The Gala",
        season: "1"
    },
})

export const listSeasons = () => [...new Set(Object.values(songLocale).map(ep => ep.season))]
export const listSongs = () => Object.keys(songLocale).map((value) => ({ key: value as Song, name: songLocale[(value as Song)].name }))

export const characterLocale: CharacterLocale = {
    ts: "Twilight",
    aj: "Applejack",
    fs: "Fluttershy",
    pp: "Pinkie",
    ra: "Rarity",
    rd: "Rainbow"
}

export const listCharacters = () => Object.keys(characterLocale).map((key) => ({ key: key as Character, name: characterLocale[key as Character] }))