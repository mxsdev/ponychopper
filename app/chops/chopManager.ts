import type { PathLike } from 'fs'
import { getWaveMeta, WaveMeta } from '../util/riff'
import { getFilesRecursively } from '../util/file'
import { arrayRandom, randomInteger } from '../util/random'
import { range } from '../util/range'
import { ChopFile, ChopSelection, regionContains, regionUnion, fragmentsToSelection, waveMetaToChopFile, selectionToBuffer, ChopSelector, createChopSelector, FilterOpts, chopFileSummary } from './chops'
import path from 'path'
import fs from 'fs/promises'

export async function createChopFileManager(fileDir: PathLike) {
    const manager = new ChopFileManager()

    await manager.loadFiles(fileDir)

    return manager
}

export type ChopSelectionListener = SelectionListener<ChopSelection>

export class ChopFileManager {
    private files: ChopFile[] = [ ]

    private selection = new SelectionHistory<ChopSelection>()

    private selector: ChopSelector|null = null
    private filterOpts: FilterOpts = { }
    private selectionList: ChopSelection[] = [ ]

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

        this.empty()
        this.selector = createChopSelector(this.files)

        this.filter(this.filterOpts)

        return this.fileSummary()
    }

    fileSummary() {
        return chopFileSummary(this.files)
    }

    filter(opts: FilterOpts) {
        this.filterOpts = opts

        if(!this.selector) return 0
        this.selectionList = this.selector(opts)

        return this.selectionList.length
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

    numSelections() {
        return this.selectionList.length
    }

    chop(): ChopSelection {
        if(this.selectionList.length === 0) throw new Error('No chops available!')

        const sel = arrayRandom(this.selectionList)
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

    empty() {
        this.selection.empty()
    }

    addSelectionListener(listener: ChopSelectionListener) { 
        this.selection.addSelectionListener(listener) 
    }

    removeSelectionListener(listener: ChopSelectionListener) {
        this.selection.removeSelectionListener(listener)
    }
}

type SelectionListener<T> = (val: T|null) => void

class SelectionHistory<T> {
    private history: T[]
    private curr: number = -1

    private selectionListeners: (SelectionListener<T>)[] = [ ]

    constructor() { this.history = []  }

    push(t: T) {
        this.history.splice(this.curr + 1, this.history.length)

        this.history.push(t)
        this.curr++

        this.emitSelection()
    }

    next() {
        if(this.curr < this.history.length - 1) {
            this.curr++
            this.emitSelection()
        }
    }

    prev() {
        if(this.curr > 0) {
            this.curr--
            this.emitSelection()
        }
    }

    empty() {
        this.history = []
        this.curr = -1

        this.emitSelection()
    }

    current(): T|undefined {
        return this.history[this.curr]
    }

    addSelectionListener(listener: SelectionListener<T>) {
        this.selectionListeners.push(listener)
    }

    removeSelectionListener(listener: SelectionListener<T>) {
        const elIndex = this.selectionListeners.indexOf(listener)

        if(elIndex > -1) {
            this.selectionListeners.splice(elIndex, 1)
        }
    }

    emitSelection() {
        const curr = this.current() || null

        this.selectionListeners.forEach((l) => l(curr))
    }
}