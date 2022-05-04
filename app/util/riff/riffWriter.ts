import { write } from "fs"
import { WaveFact, WaveFormat, WaveInfo } from "./types/chunks"
import { DWORD, WaveData } from "./types/data"

export class RIFFWriter {
    writer: ChunkWriter

    constructor(format: string) {
        this.writer = new ChunkWriter('RIFF')

        this.writer.writeFCC(format)
    }

    getWriter() {
        return this.writer
    }

    toBuffer() {
        return this.getWriter().toBuffer(this.extraData())
    }

    extraData(): Buffer[]|undefined {
        return undefined
    }
}

export class WaveWriter extends RIFFWriter {
    info: WaveInfo = { }

    constructor(fmt: WaveFormat, fact: WaveFact|undefined, data: Buffer) {
        super('WAVE')

        // Write format chunk
        const fmtChunk = new ChunkWriter('fmt ')
            .writeWord(fmt.formatTag)
            .writeWord(fmt.channels)
            .writeDWord(fmt.samplesPerSec)
            .writeDWord(fmt.avgBytesPerSec)
            .writeWord(fmt.blockAlign)

        if(fmt.bitsPerSample) fmtChunk.writeWord(fmt.bitsPerSample)

        this.getWriter().writeBuffer(fmtChunk.toBuffer())

        // Write fact chunk

        if(fact) {
            const factChunk = new ChunkWriter('fact')
                .writeDWord(fact.numSamples)

            this.getWriter().writeBuffer(factChunk.toBuffer())
        }

        // Write data chunk

        // TODO: support wavl format
        const dataChunk = new ChunkWriter('data')
            .writeBuffer(data)

        this.getWriter().writeBuffer(dataChunk.toBuffer())
    }

    extraData(): Buffer[] | undefined {
        const res: Buffer[] = []

        res.push(this.getTagChunk())

        return res.length > 0 ? res : undefined
    }

    setTag(tag: string, value: string) {
        this.info[tag] = value

        return this
    }

    getTagChunk(): Buffer {
        const writer = new ChunkWriter('LIST')
        writer.writeFCC('INFO')

        Object.keys(this.info).forEach((tag) => {
            const subwriter = new ChunkWriter(tag)
            subwriter.writeZStr(this.info[tag])

            writer.writeBuffer(subwriter.toBuffer())
        })

        return writer.toBuffer()
    }
}

export class ChunkWriter {
    chunk: { ckID: Buffer, data: Buffer[] }

    constructor(ckID: string) {
        const idBuff = fccToBuffer(ckID)

        this.chunk = {
            ckID: idBuff,
            data: []
        }
    }

    toBuffer(extra_data?: Buffer[]): Buffer {
        const data = Buffer.concat([...this.chunk.data, ...(extra_data ?? [])])

        const size = Buffer.alloc(4)
        size.writeUInt32LE(data.length)

        const res = [ this.chunk.ckID, size, data ]

        if((data.length & 1) === 1) {
            res.push(Buffer.alloc(1)) // pad byte
        }

        return Buffer.concat(res)
    }

    writeBuffer(buff: Buffer) {
        this.chunk.data.push(buff)
        return this
    }

    writeFCC(fcc: string) {
        return this.writeBuffer(fccToBuffer(fcc))
    }

    writeWord(val: number) {
        const buff = Buffer.alloc(2)
        buff.writeUint16LE(val)

        return this.writeBuffer(buff)
    }

    writeDWord(val: number) {
        const buff = Buffer.alloc(4)
        buff.writeUint32LE(val)

        return this.writeBuffer(buff)
    }

    writeZStr(str: string) {
        const buff = Buffer.alloc(str.length + 1)
        buff.write(str, 'utf-8')

        return this.writeBuffer(buff)
    }
}

function fccToBuffer(fcc: string) {
    const buff = Buffer.alloc(4)
    buff.write(fcc, 'utf-8')

    return buff
}