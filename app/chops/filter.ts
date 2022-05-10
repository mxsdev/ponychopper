import { range } from "util/range";
import { ChopFileSummary, FilterOpts } from "./chops";

export function defaultFilter(summary: ChopFileSummary): FilterOpts {
    return {
        file: summary.fileNames,
        meta: {
            season: summary.meta.seasons
        },
        pitch: {
            classes: range(1, 12 + 1),
            octaves: { gte: 0, lte: 12 },
            pm: 0
        },
        sentence: {
            numWords: { gte: 1, lte: 3 },
            other: true,
            word: true
        },
        speaker: {
            in: summary.speakers,
            nonstrict: false
        },
        syllables: {
            gte: 1,
            lte: 16
        },
        search: {
            query: '',
            type: 'fuzzy'
        }
    }
}