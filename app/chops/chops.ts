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

export const fragmentsToSpeech = (fragments: ChopFragment[], words: ChopWord[]): string => {
    let i = 0

    let str = ''

    while(i < fragments.length) {
        const frag = fragments[i]

        const containingWord = words.find(word => regionContains(word.pos, frag.pos))

        if(containingWord && containingWord.speech) {
            let running_str = frag.speech
            let j = 1

            while(fragments[j+i] && regionContains(containingWord.pos, fragments[j+i].pos)) {
                running_str += fragments[j+i].speech
                j++
            }

            if(j === containingWord.numFragments) {
                str += containingWord.speech
            } else {
                str += running_str
            }

            i += j 
        } else {
            str += frag.speech
            i++
        }
    }

    return str
}

export const fragmentsToSelection = (fileIndex: number, fragments: ChopFragment[], words: ChopWord[]): ChopSelection => {
    // get pitch list without duplicates
    const pitches: ChopPitch[] = []
    const seenPitches: Record<string, boolean> = { }

    fragments.flatMap(f => f.pitches ?? []).forEach(p => {
        const sp = serializePitch(p)
        if(seenPitches[sp]) return

        pitches.push(p)
        seenPitches[sp] = true
    })

    return ({
        fileIndex,
        pos: regionUnion(...fragments.map(f => f.pos)),
        speech: fragmentsToSpeech(fragments, words),

        pitches,
        speakers: [...new Set<string>( fragments.flatMap(f => f.speakers ?? []) )],
        syllables: fragments.reduce((prev, curr) => prev + curr.syllables, 0)
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