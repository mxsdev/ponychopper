import { ChunkMeta } from "./types/chunks"
import { RIFFMeta } from "./types/riff"
import { ChunkReader } from "./chunkReader"
import { parseChunkHeader } from "./parseChunk"
import { WaveData } from "./types/data";

/**
 * Abstraction of fs.FileHandle
 * 
 * This is a general interface which can read a specified number
 * of bytes at a specific location in a buffer
 * 
 */
 export interface BufferHandle {
    read(buffer: Buffer, offset?: number | null, length?: number | null, position?: number | null): Promise<{bytesRead: number}>;
}

class RIFFParseError extends Error {
    constructor(message: string) {
        super(message)
        this.name = this.constructor.name
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor)
        } else { 
            this.stack = (new Error(message)).stack
        }
    }
}

export class InvalidRIFFFileFormatError extends RIFFParseError { }
export class RIFFFileEOLError extends RIFFParseError { }

/**
 * Traverses the chunks of a generic RIFF file
 * from a handle to a buffer (e.g. fs.FileHandle)
 */
export class RIFFReader {
    private pos: number
    private handle: BufferHandle
    private size: number
    private initialized: boolean = false

    chunk: ChunkMeta|null = null

    /**
     * Create a new RIFF Reader
     * 
     * @param handle 
     * @param size 
     * @param start 
     */
    constructor(handle: BufferHandle, size: number, start: number = 0, initialized: boolean = false) {
        this.pos = start
        this.handle = handle
        this.size = size
        this.initialized = initialized
    }

    async init(): Promise<RIFFMeta> {
        let buff: Buffer

        try {
            buff = await this.read(12, true, true)
        } catch(e: any) {
            if(e instanceof RIFFFileEOLError) {
                throw new InvalidRIFFFileFormatError('File not a valid RIFF file')
            } else {
                throw e
            }
        }

        const header_reader = new ChunkReader(buff)

        const file_header = header_reader.readFCC()

        if(file_header !== 'RIFF') {
            throw new InvalidRIFFFileFormatError('File not a valid RIFF file')
        }

        const file_size = header_reader.readDWord()
        const file_type = header_reader.readFCC()

        this.initialized = true

        return {
            file_size, file_type
        }
    }

    eol() {
        return this.remaining() <= 0
    }

    remaining() {
        return this.size - this.pos
    }

    advance(by: number) {
        this.pos += by
    }

    private async _read(buffer: Buffer, num_bytes: number, advance: boolean = false, offset: number = 0): Promise<number> {
        if(this.remaining() < num_bytes) {
            throw new RIFFFileEOLError('Attempted to read beyond end of line')
        }

        const { bytesRead } = await this.handle.read(buffer, 0, num_bytes, this.pos + offset)
        if(advance) this.advance(num_bytes)

        return bytesRead
    }

    private async read(num_bytes: number, advance: boolean = true, force: boolean = false, offset: number = 0): Promise<Buffer> {
        if(!force && !this.initialized) throw new Error('Cannot read from riff file without running init()!')

        const buffer = Buffer.alloc(num_bytes)

        const res = await this._read(buffer, num_bytes, advance, offset)

        return buffer
    }

    chunkLoaded(): boolean {
        return !!this.chunk
    }

    async nextChunk(): Promise<ChunkMeta> {
        if(8 > this.remaining() && !this.eol()) {
            throw new InvalidRIFFFileFormatError('Invalid RIFF File')
        }

        if(this.chunkLoaded()) throw new Error('Chunk already loaded!')

        const buf = await this.read(8)

        const chunkMeta = parseChunkHeader(buf)

        this.chunk = chunkMeta
        
        return chunkMeta
    }

    async getChunkMeta(): Promise<{type: 'unknown'}|{type: 'list', list_type: string}> {
        if(!this.chunkLoaded()) throw new Error('No chunk currently loaded!')

        const [ ckID ] = this.chunk!

        if(ckID === 'LIST') {
            if(4 > this.remaining()) throw new InvalidRIFFFileFormatError('Invalid RIFF File - LIST block does not have a 4-byte type description')

            const header =  (await this.read(4, false)).toString('utf-8')
            return { type: 'list', list_type: header }
        }

        return {type: 'unknown'}
    }

    async readCurrentChunk(): Promise<Buffer> {
        if(!this.chunkLoaded()) throw new Error('No chunk currently loaded!')

        const [ ckID, ckSize ] = this.chunk!

        if(ckSize > this.remaining()) {
            throw new InvalidRIFFFileFormatError('Invalid RIFF File')
        }

        const buf = await this.read(ckSize)
        this.advance(ckSize & 1) // account for pad byte

        this.discardCurrentChunk()
        
        return buf
    }

    async skipCurrentChunk() {
        if(!this.chunkLoaded()) {
            throw new Error('No chunk currently loaded!')
        }

        const [ ckID, ckSize ] = this.chunk!

        this.advance(ckSize + (ckSize & 1)) // account for pad byte

        this.discardCurrentChunk()
    }

    private discardCurrentChunk() {
        this.chunk = null
    }

    async isSampleDataChunk(): Promise<'data'|'list'|false> {
        if(!this.chunkLoaded()) return false
        
        const isDataChunk = (this.chunk!)[0] === 'data'
        if(isDataChunk) return 'data'

        const meta = await this.getChunkMeta()
        if(meta.type === 'list' && meta.list_type === 'wavl') return 'list'

        return false
    }

    async getSampleRange(position: number, length: number, sampleSize: number): Promise<WaveData> {
        const sampleChunkType = await this.isSampleDataChunk()
        if(!sampleChunkType) throw new Error('Sample data chunk not active!')
        
        const res: WaveData = [ ]

        if(sampleChunkType === 'data') {
            const buff = await this.read(length*sampleSize, false, false, position*sampleSize)
            res.push({ type: 'data', data: buff })
        } else if(sampleChunkType === 'list') {
            // TODO: implement list data type
            throw new Error('WAVE data format unsupported')
        }

        return res
    }
}