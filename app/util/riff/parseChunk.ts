import type { WaveADTL, WaveADTLFile, WaveADTLLTxt, WaveADTLLabel, WaveADTLNote, WaveCues, WaveFormat, ChunkMeta, WaveInfo, WaveFact } from './types/chunks'
import { ChunkReader } from './chunkReader';

export function parseChunkHeader(header: Buffer): ChunkMeta {
    const id_buffer = header.slice(0, 4)
    const size_buffer = header.slice(4, 8)

    return [
        id_buffer.toString('utf-8'),
        size_buffer.readInt32LE()
    ]
}
export namespace ParseWave {
    export function parseFormatChunk(chunk: Buffer): WaveFormat {
        const reader = new ChunkReader(chunk)
    
        const formatTag = reader.readWord()
        const channels = reader.readWord()
        const samplesPerSec = reader.readDWord()
        const avgBytesPerSec = reader.readDWord()
        const blockAlign = reader.readWord()
        
        const bitsPerSample = (reader.remaining() >= 2) ? reader.readWord() : undefined
    
        return { formatTag, channels, samplesPerSec, avgBytesPerSec, blockAlign, bitsPerSample }
    }
    
    export function parseCueChunk(chunk: Buffer): WaveCues {
        const cues: WaveCues = []
    
        const reader = new ChunkReader(chunk)
    
        const num_cpoints = reader.readDWord()
    
        for (let i = 0; i < num_cpoints; i++) {
            const id = reader.readDWord()
            const position = reader.readDWord()
            const chunk = reader.readFCC()
            const chunkStart = reader.readDWord()
            const blockStart = reader.readDWord()
            const sampleOffset = reader.readDWord()
    
            cues.push({ id, position, chunk, chunkStart, blockStart, sampleOffset })
        }
    
        return cues
    }
    
    export function parseInfoChunk(chunk: Buffer): WaveInfo {
        const reader = new ChunkReader(chunk)
        const info: WaveInfo = { }

        const list_type = reader.readFCC()

        while(!reader.eol()) {
            const [ckID, ckSize, ckData] = reader.readSubchunk()

            // Remove null termination
            info[ckID] = ckData.slice(0, -1).toString('utf-8')
        }

        return info
    }

    export function parseFactChunk(chunk: Buffer): WaveFact {
        const reader = new ChunkReader(chunk)

        const dwFileSize = reader.readDWord()

        return { numSamples: dwFileSize }
    }

    export namespace ADTL {
        export function parseWaveADTLChunk(chunk: Buffer): WaveADTL {
            const reader = new ChunkReader(chunk)
            const adtl: WaveADTL = []
        
            const list_type = reader.readFCC()
            
            while(!reader.eol()) {
                const [ckID, ckSize, ckData] = reader.readSubchunk()
        
                switch(ckID) {
                    case 'labl':
                        adtl.push(parseLabelSubchunk(ckData))
                        break
                    case 'ltxt':
                        adtl.push(parseLTxtSubchunk(ckData))
                        break
                    case 'note':
                        adtl.push(parseNoteSubchunk(ckData))
                        break
                    case 'file':
                        adtl.push(parseFileSubchunk(ckData))
                        break
                }
            }
        
            return adtl
        }
        
        function parseLabelSubchunk(subchunk: Buffer): WaveADTLLabel {
            const reader = new ChunkReader(subchunk)
        
            const id = reader.readDWord()
            const data = reader.readZStr()
        
            return { type: 'labl', id, data }
        }
        
        function parseLTxtSubchunk(subchunk: Buffer): WaveADTLLTxt {
            const reader = new ChunkReader(subchunk)
        
            const id = reader.readDWord()
            const sampleLength = reader.readDWord()
            const purpose = reader.readDWord()
            const country = reader.readWord()
            const language = reader.readWord()
            const dialect = reader.readWord()
            const codePage = reader.readWord()
            const data = reader.readRemaining()
        
            return { type: 'ltxt', id, sampleLength, purpose, country, language, dialect, codePage, data }
        }
        
        function parseNoteSubchunk(subchunk: Buffer): WaveADTLNote {
            const reader = new ChunkReader(subchunk)
        
            const id = reader.readDWord()
            const data = reader.readZStr()
        
            return { type: 'note', id, data }
        }
        
        function parseFileSubchunk(subchunk: Buffer): WaveADTLFile {
            const reader = new ChunkReader(subchunk)
        
            const id = reader.readDWord()
            const medType = reader.readDWord()
            const fileData = reader.readRemaining()
        
            return { type: 'file', id, medType, fileData }
        }
    }
}