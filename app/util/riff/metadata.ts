import { WaveADTL, WaveCues, WaveFact, WaveFormat, WaveInfo, WaveMeta } from "./types/chunks";
import { ParseWave } from "./parseChunk";
import { BufferHandle, InvalidRIFFFileFormatError, RIFFReader } from "./riffReader";

/**
 * Retrieves the metadata from a wave file
 * without loading its data into memory
 * 
 * @param handle 
 * @param size 
 * @returns 
 */
export async function getWaveMeta(handle: BufferHandle, size: number): Promise<WaveMeta> {
    let fmt: WaveFormat|undefined = undefined
    let cue: WaveCues = []
    let adtl: WaveADTL = []
    let info: WaveInfo = {}
    let fact: WaveFact|undefined = undefined

    const riffReader = new RIFFReader(handle, size)

    const {file_type} = await riffReader.init()

    if(file_type !== 'WAVE') {
        throw new InvalidRIFFFileFormatError('File must be of WAVE type')
    }

    while(!riffReader.eol()) {
        const [ ckID, ckSize ] = await riffReader.nextChunk()

        if(ckID === 'fmt ') {
            const buff = await riffReader.readCurrentChunk()
            fmt = ParseWave.parseFormatChunk(buff)
        } else if(ckID === 'cue ') {
            const buff = await riffReader.readCurrentChunk()
            cue = ParseWave.parseCueChunk(buff)
        } else if(ckID === 'fact') {
            const buff = await riffReader.readCurrentChunk()
            fact = ParseWave.parseFactChunk(buff)
        } else if(ckID === 'LIST') {
            const meta = await riffReader.getChunkMeta()

            if(meta.type === 'list') {
                if(meta.list_type === 'adtl') {
                    const buff = await riffReader.readCurrentChunk()
                    adtl = ParseWave.ADTL.parseWaveADTLChunk(buff)
                }else if(meta.list_type === 'INFO') {
                    const buff = await riffReader.readCurrentChunk()
                    info = ParseWave.parseInfoChunk(buff)
                }
                
            }
        }
        if(riffReader.chunkLoaded()) riffReader.skipCurrentChunk()
    }

    if(!fmt) throw new Error('fmt chunk missing from wave file')

    return { fmt, cue, adtl, info, fact }
}