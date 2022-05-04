import { ParseWave } from "./parseChunk";
import { BufferHandle, RIFFReader } from "./riffReader";
import { WaveFormat } from "./types/chunks";
import { WaveData } from "./types/data";

export async function getWaveSampleRange(handle: BufferHandle, size: number, position: number, length: number): Promise<{fmt: WaveFormat, data: Buffer}> {
    const reader = new RIFFReader(handle, size)
    await reader.init()

    let fmt: WaveFormat|null = null

    while(!reader.eol()) {
        const [ckID] = await reader.nextChunk()

        if(ckID === 'fmt ') {
            fmt = ParseWave.parseFormatChunk(await reader.readCurrentChunk())
        } else if(await reader.isSampleDataChunk()) {
            if(fmt == null) throw new Error('Invalid WAVE File - Does not include fmt chunk before data chunk!')

            const { blockAlign: sampleSize } = fmt

            const data = waveDataToBuffer(await reader.getSampleRange(position, length, sampleSize), sampleSize)

            return { fmt, data }
        } else {
            await reader.skipCurrentChunk()
        }
    }

    throw new Error('Wave file has no data')
}

function waveDataToBuffer(data: WaveData, sampleSize: number): Buffer {
    if(data.length === 1 && data[0].type === 'data') return data[0].data

    const numBytes = data.reduce((prev: number, curr) => prev + waveDataChunkSize(curr, sampleSize), 0)
    const buff = Buffer.alloc(numBytes)

    let byteIndex = 0

    data.forEach((d) => {
        if(d.type === 'data') {
            buff.set(d.data, byteIndex)
        }

        byteIndex += waveDataChunkSize(d, sampleSize)
    })

    return buff
}

function waveDataChunkSize(data: WaveData[number], sampleSize: number): number {
    return (data.type === 'data' ? data.data.length : data.length * sampleSize)
}