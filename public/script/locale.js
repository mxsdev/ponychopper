"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCharacters = exports.characterLocale = exports.listSongs = exports.listSeasons = exports.songLocale = void 0;
exports.songLocale = ({
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
});
const listSeasons = () => [...new Set(Object.values(exports.songLocale).map(ep => ep.season))];
exports.listSeasons = listSeasons;
const listSongs = () => Object.keys(exports.songLocale).map((value) => ({ key: value, name: exports.songLocale[value].name }));
exports.listSongs = listSongs;
exports.characterLocale = {
    ts: "Twilight",
    aj: "Applejack",
    fs: "Fluttershy",
    pp: "Pinkie",
    ra: "Rarity",
    rd: "Rainbow",
    m6: "Mane 6"
};
const listCharacters = () => Object.keys(exports.characterLocale).map((key) => ({ key: key, name: exports.characterLocale[key] }));
exports.listCharacters = listCharacters;
//# sourceMappingURL=locale.js.map