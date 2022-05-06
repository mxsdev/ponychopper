import { getContiguousSubarrays } from './../util/arrays';
import { getWaveSampleRange, WaveMeta, WaveWriter } from "../util/riff"
import fs from 'fs/promises'
import type { PathLike } from 'fs'

export type ChopPosIndex = number

export type ChopPosRegion = { 
    start: ChopPosIndex,
    length: ChopPosIndex
}

export type ChopPitch = { class: number, octave: number }

export type ChopPhrase = {
    pos: ChopPosRegion
}

export type ChopWord = {
    pos: ChopPosRegion,
    numFragments: number,
    speech?: string
}

export type ChopFragment = {
    speech: string,
    syllables: number,
    pos: ChopPosRegion,
    pitches?: ChopPitch[],
    speakers?: string[]
}

export type ChopFile = {
    /**
     * Wave file metadata
     */
    wavMeta: WaveMeta,
    /**
     * File path relative to
     * user's audio directory
     */
    location: PathLike,
    /**
     * Chop metadata
     */
    meta: {
        season?: number
    },
    /**
     * List of chops
     */
    chops: ChopFragment[],
    /**
     * List of words
     */
    words: ChopWord[],
    /**
     * List of phrases
     */
    phrases: ChopPhrase[],
    /**
     * List of gaps
     */
    gaps: ChopPosIndex[]
}

export type ChopSelection = {
    fileIndex: number,
    pos: ChopPosRegion,
    speech: string,

    pitches: ChopPitch[],
    speakers: string[],
    syllables: number,

    word: {
        numWords: number,
        leftFull: boolean, rightFull: boolean,
    },

    phrase: {
        numPhrases: number,
        leftFull: boolean, rightFull: boolean
    },

    fragmentIndex: number,
    fragmentLength: number,

    buffer?: Buffer
}

export const regionContains = (region: ChopPosRegion, index: ChopPosIndex|ChopPosRegion) => {
    const indexPos = (typeof index === 'object') ? index.start : index

    return ( region.start <= indexPos && (region.start + region.length) >= indexPos )
}

export const regionUnion = (...regions: ChopPosRegion[]): ChopPosRegion => {
    const start = Math.min(...regions.map(r => r.start))
    const length =  Math.max(...regions.map(r => r.start + r.length)) - start
    
    return { start, length }
}

const serializePitch = (pitch: ChopPitch): string => `${pitch.class},${pitch.octave}`

export type ChopFileSummary = {
    speakers: string[],
    numChopFragments: number,
    numFiles: number
}

export function chopFileSummary(files: ChopFile[]): ChopFileSummary {
    return ({
        numFiles: files.length,
        numChopFragments: files.reduce((prev, curr) => prev + curr.chops.length, 0),
        speakers: [...new Set<string>(files.flatMap(f => f.chops.flatMap(f => f.speakers ?? [])))]
    })
}

export const fragmentsToSpeech = (fragments: ChopFragment[], words: ChopWord[]): { speech: string } & Pick<ChopSelection, 'word'> => {
    let i = 0

    let speech = ''

    let numWords = 0
    let leftFull = false
    let rightFull = false

    while(i < fragments.length) {
        const frag = fragments[i]

        const containingWord = words.find(word => regionContains(word.pos, frag.pos))

        if(containingWord) {
            let running_speech = frag.speech
            let j = 1

            while(fragments[j+i] && regionContains(containingWord.pos, fragments[j+i].pos)) {
                running_speech += fragments[j+i].speech
                j++
            }

            if(j === containingWord.numFragments) {
                speech += containingWord.speech ?? running_speech

                if(i === 0) {
                    leftFull = true
                }else if(i + j === fragments.length) {
                    rightFull = true
                }
            } else {
                speech += running_speech
            }

            i += j 
            numWords++
        } else {
            speech += frag.speech
            i++
        }
    }

    return { speech, word: { leftFull, rightFull, numWords }}
}

export const fragmentsToSelection = (fileIndex: number, fragments: ChopFragment[], words: ChopWord[], fragmentIndex: number, fragmentLength: number): ChopSelection => {
    // get pitch list without duplicates
    const pitches: ChopPitch[] = []
    const seenPitches: Record<string, boolean> = { }

    fragments.flatMap(f => f.pitches ?? []).forEach(p => {
        const sp = serializePitch(p)
        if(seenPitches[sp]) return

        pitches.push(p)
        seenPitches[sp] = true
    })

    const { speech, word } = fragmentsToSpeech(fragments, words)

    return ({
        fileIndex,
        pos: regionUnion(...fragments.map(f => f.pos)),
        speech,

        pitches,
        speakers: [...new Set<string>( fragments.flatMap(f => f.speakers ?? []) )],
        syllables: fragments.reduce((prev, curr) => prev + curr.syllables, 0),

        fragmentIndex, fragmentLength,

        word,
        phrase: { numPhrases: 0, leftFull: false, rightFull: false }
    })
}

export async function selectionToBuffer(selection: ChopPosRegion, file: PathLike): Promise<Buffer> {
    const handle = await fs.open(file, 'r')
    const size = (await handle.stat()).size

    const {fmt, data} = await getWaveSampleRange(handle, size, selection.start, selection.length)

    await handle.close()

    const writer = new WaveWriter(fmt, { numSamples: selection.length }, data)
        .setTag('ICMT', 'Created with ponychopper.')

    return writer.toBuffer()
}

type WaveRegion = ({ label: string, position: number }&({type: 'marker'}|{type: 'region', length: number}))

function waveMetaToRegions(meta: WaveMeta): WaveRegion[] {
    const res: WaveRegion[] = []

    meta.cue.forEach(cp => {
        const cp_adtl = meta.adtl.filter(s => s.id === cp.id)

        const adtl_labl = cp_adtl.find(s => s.type === 'labl')
        if(!adtl_labl || adtl_labl.type !== 'labl') return

        const label = adtl_labl.data

        const adtl_ltxt = cp_adtl.find(s => s.type === 'ltxt')
        const is_region = !!adtl_ltxt && adtl_ltxt.type === 'ltxt'
        const length = is_region ? adtl_ltxt.sampleLength : undefined

        res.push({
            label, position: cp.position,
            type: is_region ? 'region' : 'marker',
            // @ts-ignore
            length
        })
    })

    return res
}

type CueType = (
    {
        type: 'meta',
        season?: number
    }
    |{
        type: 'word',
        pos: ChopPosRegion,
        speech?: string
    }
    |{
        type: 'phrase'
        pos: ChopPosRegion,
    }
    |{
        type: 'gap',
        pos: ChopPosIndex
    }
    |{
        type: 'speaker',
        speakers: string[],
        pos: ChopPosRegion
    }
    |{
        type: 'chop',
        speech: string,
        syllables: number,
        pitches?: ChopPitch[]
        pos: ChopPosRegion,
    }
)

const PITCH_TO_NUMBER: Record<string, number> = {
    'cb': 12,
    'c': 1,
    'c#': 2,
    'db': 2,
    'd': 3,
    'd#': 4,
    'eb': 4,
    'e': 5,
    'e#': 6,
    'fb': 5,
    'f': 6,
    'f#': 7,
    'gb': 7,
    'g': 8,
    'g#': 9,
    'ab': 9,
    'a': 10,
    'a#': 11,
    'bb': 11,
    'b': 12,
    'b#': 1
}

function parsePitchArg(arg: string): ChopPitch[] {
    const res: ChopPitch[] = []

    arg.split(',').forEach((p) => {
        const m = p.match(/(.*?)(\d+)/)

        const note_str = m?.[1]?.toLowerCase()
        const octave = Number(m?.[2])

        if(!note_str || octave == null || isNaN(octave)) return

        const note = PITCH_TO_NUMBER[note_str]

        if(note == null) return

        res.push({ class: note, octave })
    })

    return res
}

function getCueType(region: WaveRegion): CueType|null {
    const { label, ...r } = region

    const parts = label.split(/\s+/)

    if(parts.length === 0) return null

    const first = parts.shift()!

    const args: string[] = [ ]
    const kwargs: Record<string, string> = { }

    parts.forEach(p => {
        const argsplit = p.split(':')

        if(argsplit.length > 1) {
            kwargs[argsplit[0]] = argsplit[1]
        } else {
            args.push(argsplit[0])
        }
    })

    if(first.charAt(0) === '@') {
        const coml = first.toLowerCase()

        switch(coml) {
            case "@meta":
                return { type: 'meta', season: Number(kwargs['season']) ?? undefined }
            case "@word":
                if(r.type !== 'region') return null
                return { type: 'word', speech: args[0], pos: { start: r.position, length: r.length } }
            case "@phrase":
                if(r.type !== 'region') return null
                return { type: 'phrase', pos: { start: r.position, length: r.length } }
            case "@gap":
                return { type: 'gap', pos: r.position}
            case "@char":
                if(r.type !== 'region') return null
                return { type: 'speaker', speakers: args, pos: { start: r.position, length: r.length }}
        }
    } else {
        if(r.type !== 'region') return null

        const syll_arg = Number(args[0])
        const syllables = isNaN(syll_arg) ? 1 : syll_arg

        const pitch_arg: string|undefined = kwargs['p'] || kwargs['pitch']
        const pitches = pitch_arg ? parsePitchArg(pitch_arg) : undefined

        return {
            type: 'chop',
            syllables,
            pitches,
            speech: first,
            pos: { start: r.position, length: r.length }
        }
    }

    return null
}

export function waveMetaToChopFile(wavMeta: WaveMeta, location: PathLike): ChopFile {
    const regions = waveMetaToRegions(wavMeta)

    const rinfo = regions.map(r => getCueType(r))
        .filter(c => c) as CueType[]

    const rtype = <T extends CueType['type']>(type: T) => rinfo.filter(c => c.type === type) as ({ type: T } & CueType)[]

    const speakers = rtype('speaker')

    const chops: ChopFragment[] = rtype('chop')
        .map(c => ({
            pos: c.pos, speech: c.speech, syllables: c.syllables, pitches: c.pitches,
            speakers: [...new Set<string>(
                speakers
                    .filter(s => regionContains(s.pos, c.pos))
                    .flatMap(s => s.speakers)
            )]
        }))
        .sort((a, b) => a.pos.start - b.pos.start)

    const words: ChopWord[] = rtype('word')
        .map(c => ({
            pos: c.pos,
            numFragments: chops.filter(frag => regionContains(c.pos, frag.pos)).length,
            speech: c.speech
        }))

    words.push(
        ...chops
            .filter(c => !words.some(w => regionContains(w.pos, c.pos)))
            .map(v => ({
                pos: {
                    start: v.pos.start,
                    length: 0
                },
                numFragments: 1
            }))
    )

    const chopMeta: ChopFile['meta'] = rtype('meta')
        .reduce((prev, curr) => {
            return ({
                ...prev,
                ...(curr.season ? { season: curr.season } : { })
            })
        }, {})

    const phrases: ChopPhrase[] = rtype('phrase')
        .map(c => ({
            pos: c.pos
        }))

    const gaps: ChopPosIndex[] = rtype('gap')
        .map(c => c.pos)

    return {
        chops, gaps, location, meta: chopMeta, wavMeta, phrases, words
    }
}

const MAX_SELECTION_FRAGMENTS = 16

function getAllChopSelections(file: ChopFile, fileIndex: number): ChopSelection[] {
    const res: ChopSelection[] = [ ]

    const chunks: ChopFragment[][] = [ ]

    let i = 0
    let j = 0

    while( i < file.gaps.length && j < file.chops.length ) {
        const chunk: ChopFragment[] = []

        while(file.chops[j].pos.start <= file.gaps[i]) {
            chunk.push(file.chops[j])

            j++
        }

        if(chunk.length > 0) chunks.push(chunk)

        i++
    }

    let k = 0

    chunks.forEach(chunk => {
        for (let x = 0; x < chunk.length; x++) {
            for (let y = x; y < chunk.length; y++) {
                if(y - x + 1 > MAX_SELECTION_FRAGMENTS) continue

                res.push(
                    fragmentsToSelection(
                        fileIndex,
                        chunk.slice(x, y+1),
                        file.words,
                        x+k, y+k
                    )
                )
            }
        }

        k += chunk.length
    })

    // while( i < file.gaps.length ) {
    //     const l: number = (i < 0 ? -Infinity : file.gaps[i])
    //     const r: number = (i + 1 === file.gaps.length ? Infinity : file.gaps[i+1])

    //     const fragments = file.chops.filter(c => c.pos.start >= l && c.pos.start <= r)

    //     res.push(
    //         ...getContiguousSubarrays(fragments)
    //             .map(v => fragmentsToSelection(
    //                 fileIndex, v, file.words, file.chops.indexOf(v[0]),
    //                 file.chops.indexOf(v[v.length-1])
    //             ))
    //     )

    //     i++
    // }

    return res
}

export type FilterOpts = {
    syllables?: { 
        gte?: number,
        lte?: number
    }
}

export type ChopSelector = (opts: FilterOpts) => ChopSelection[]

export function createChopSelector(files: ChopFile[]): ChopSelector {
    const selections: ChopSelection[] = files.flatMap((file, i) => getAllChopSelections(file, i))

    return ((opts) => {
        return selections
            .filter((sel) => {
                const gte = opts.syllables?.gte
                const lte = opts.syllables?.lte

                if(gte != null && !(sel.syllables >= gte)) return false
                if(lte != null && !(sel.syllables <= lte)) return false

                return true
            })
    })
}