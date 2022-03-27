export type Season = "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"

export type Character = "ts"|"aj"|"rd"|"ra"|"fs"|"pp"|"m6"

export type Song = '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'11'|'12'|'13'|'14'|'15'|'16'|'17'|'18'

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
    '0': {
        name: "Intro",
        season: "1"
    },
    '1': {
        name: "Laughter Song",
        season: "1"
    },
    '2': {
        name: "Pinkie's Gala Fantasy Song",
        season: "1"
    },
    '3': {
        name: "The Ticket Song",
        season: "1"
    },
    "4": {
        name: "Hop Skip and Jump",
        season: "1"
    },
    "5": {
        name: "Evil Enchantress",
        season: "1"
    },
    "6": {
        name: "Evil Enchantress Reprise",
        season: "1"
    },
    "7": {
        name: "Winter Wrap Up",
        season: "1"
    },
    "8": {
        name: "Cupcakes Song",
        season: "1"
    },
    "9": {
        name: "Art of the Dress",
        season: "1"
    },
    "10": {
        name: "Art of the Dress Reprise",
        season: "1"
    },
    "11": {
        name: "Hush Now Lullaby",
        season: "1"
    },
    "12": {
        name: "Cutie Mark Crusaders Song",
        season: "1"
    },
    "13": {
        name: "You Got to Share, You Got to Care",
        season: "1"
    },
    "14": {
        name: "So Many Wonders",
        season: "1"
    },
    "15": {
        name: "Pinkie Pie's Singing Telegram",
        season: "1"
    },
    "16": {
        name: "At The Gala",
        season: "1"
    },
    "17": {
        name: "I'm at the Grand Galloping Gala",
        season: "1"
    },
    "18": {
        name: "Poney Pokey",
        season: "1"
    }
})

export const listSeasons = () => [...new Set(Object.values(songLocale).map(ep => ep.season))]
export const listSongs = () => Object.keys(songLocale).map((value) => ({ key: value as Song, name: songLocale[(value as Song)].name }))

export const characterLocale: CharacterLocale = {
    ts: "Twilight",
    aj: "Applejack",
    fs: "Fluttershy",
    pp: "Pinkie",
    ra: "Rarity",
    rd: "Rainbow",
    m6: "Mane 6"
}

export const listCharacters = () => Object.keys(characterLocale).map((key) => ({ key: key as Character, name: characterLocale[key as Character] }))