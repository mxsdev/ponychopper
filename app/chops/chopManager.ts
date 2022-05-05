import type { PathLike } from 'fs'
import { getWaveMeta, WaveMeta } from '../util/riff'
import { getFilesRecursively } from '../util/file'
import { arrayRandom, randomInteger } from '../util/random'
import { range } from '../util/range'
import { ChopFile, ChopSelection, regionContains, regionUnion, fragmentsToSelection, waveMetaToChopFile, selectionToBuffer } from './chops'
import path from 'path'
import fs from 'fs/promises'

export async function createChopFileManager(fileDir: PathLike) {
    const manager = new ChopFileManager()

    await manager.loadFiles(fileDir)

    return manager
}

export class ChopFileManager {
    private files: ChopFile[] = [ ]

    private selection = new SelectionHistory<ChopSelection>()

    constructor() { }

    async loadFiles(fileDir: PathLike) {
        // TODO: load files from directory
        this.files = [ ]

        const folder = fileDir.toString()
        const files = await getFilesRecursively(folder)

        await Promise.all(files.map(async f => {
            const extname = path.extname(f).toLowerCase()
            if(extname !== '.wav') return

            const handle = await fs.open(f, 'r')

            try {
                const { size } = await handle.stat()
                const meta = await getWaveMeta(handle, size)

                // const location = path.relative(folder, f)

                const cf = waveMetaToChopFile(meta, f)

                this.files.push(cf)
            } catch(e) {
                console.error(`Failure reading wave file ${path.basename(f)}`, e)
            }
            
            await handle.close()
        }))
    }

    current(): ChopSelection|undefined {
        return this.selection.current()
    }

    currentFile(): PathLike|undefined {
        const curr = this.current()
        if(!curr) return undefined

        return this.files[curr.fileIndex]?.location
    }

    async buffer(): Promise<Buffer> {
        const curr = this.current()
        const curr_file = this.currentFile()

        if(!curr || !curr_file) throw new Error('Cannot get buffer without selection')

        if(curr.buffer) return curr.buffer

        const buff = await selectionToBuffer(curr.pos, curr_file)

        curr.buffer = buff

        return buff
    }

    chop(maxSyllables: number = 8): ChopSelection {
        // TODO: allow filter options as argument

        // for now: make a contiguous selection
        // that does not include a gap

        if(this.files.length === 0) throw new Error('No chops loaded!')

        const fileIndex = randomInteger(this.files.length)
        const file = this.files[fileIndex]

        const chopIndex = randomInteger(file.chops.length)
        const chopFirst = file.chops[chopIndex]

        const min = Math.min(...file.gaps.filter(gap => gap > chopFirst.pos.start))

        let n = 1

        while(chopIndex + n < file.chops.length && file.chops[chopIndex + n].pos.start < min) {
            n++
        }

        const numChops = randomInteger(1, Math.min(n, maxSyllables)+1)

        const fragments = file.chops.slice(chopIndex, chopIndex + numChops)

        const sel = fragmentsToSelection(fileIndex, fragments, file.words)

        this.selection.push(sel)

        return sel
    }

    prev() {
        this.selection.prev()
        return this.current()
    }

    next() {
        this.selection.next()
        return this.current()
    }

    numFiles() {
        return this.files.length
    }
}

class SelectionHistory<T> {
    private history: T[]
    private curr: number = -1

    constructor() { this.history = []  }

    push(t: T) {
        this.history.splice(this.curr + 1, this.history.length)

        this.history.push(t)
        this.curr++
    }

    next() {
        if(this.curr < this.history.length - 1) {
            this.curr++
        }
    }

    prev() {
        if(this.curr > 0) {
            this.curr--
        }
    }

    current(): T|undefined {
        return this.history[this.curr]
    }
}