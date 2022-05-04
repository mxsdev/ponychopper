export type ChunkMeta = [ ckID: string, ckSize: number ]

export type WaveFormat = {
    formatTag: number,
    channels: number,
    samplesPerSec: number,
    avgBytesPerSec: number,
    blockAlign: number,
    bitsPerSample?: number
}

export type WaveCue = {
    id: number,
    position: number,
    chunk: string,
    chunkStart: number,
    blockStart: number,
    sampleOffset: number
}

export type WaveCues = WaveCue[]

export type WaveMeta = {
    fmt: WaveFormat,
    cue: WaveCues,
    adtl: WaveADTL,
    info: WaveInfo,
    fact?: WaveFact
}

export type WaveADTLLabel = {
    type: 'labl',
    id: number,
    data: string
}

export type WaveADTLNote = {
    type: 'note',
    id: number,
    data: string
}

export type WaveADTLLTxt = {
    type: 'ltxt',
    id: number,
    sampleLength: number,
    purpose: number,
    country: number,
    language: number,
    dialect: number,
    codePage: number,
    data: Buffer
}

export type WaveADTLFile = {
    type: 'file',
    id: number,
    medType: number,
    fileData: Buffer
}

export type WaveADTL = (WaveADTLLabel|WaveADTLLTxt|WaveADTLNote|WaveADTLFile)[]

export type WaveInfo = { [type: string]: string }

export type WaveFact = { numSamples: number }