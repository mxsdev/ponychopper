import { range } from "util/range";
import { ChopFileSummary, FilterOpts } from "./chops";

export function defaultFilter(summary: ChopFileSummary): FilterOpts {
    return {
        file: { in: summary.fileNames },
        meta: {
            season: summary.meta.seasons
        },
        pitch: {
            classes: range(1, 12 + 1),
            octaves: { gte: 0, lte: 12 },
            pm: 0
        },
        sentence: {
            numWords: { eq: 1 },
            other: true,
            word: true
        },
        speaker: {
            in: summary.speakers,
            nonstrict: false
        },
        syllables: {
            numSyllables: {
                gte: 1,
                lte: 16
            }
        },
        search: {
            query: '',
            type: 'fuzzy'
        }
    }
}