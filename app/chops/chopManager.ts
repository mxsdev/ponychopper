import type { PathLike } from 'fs'
import { getWaveMeta, WaveMeta } from '../util/riff'
import { getFilesRecursively } from '../util/file'
import { arrayRandom, randomInteger } from '../util/random'
import { range } from '../util/range'
import { ChopFile, ChopSelection, regionContains, regionUnion, fragmentsToSelection, waveMetaToChopFile, selectionToBuffer, ChopSelector, createChopSelector, FilterOpts, chopFileSummary, ChopFileSummary } from './chops'
import path from 'path'
import fs from 'fs/promises'
import EventEmitter from 'events'
import TypedEmitter from "typed-emitter"
import { HighlightSharp } from '@mui/icons-material'
import { TypedEmitterInstance } from 'util/emitter'

export async function createChopFileManager(fileDir: PathLike) {
    const manager = new ChopFileManager()

    await manager.loadFiles(fileDir)

    return manager
}

export type ChopFileStatus = {
    loading: boolean,
    summary?: ChopFileSummary
}

type ChopFileManagerMessages = {
    'select': (selection: ChopSelection|null) => void,
    'buffer': (buffer: Buffer) => void,
    'fileStatus': (status: ChopFileStatus) => void
}

export class ChopFileManager extends (EventEmitter as TypedEmitterInstance<ChopFileManagerMessages>) {
    private files: ChopFile[] = [ ]

    private selection = new SelectionHistory()

    private status: ChopFileStatus = { loading: false }

    private selector: ChopSelector|null = null
    private filterOpts: FilterOpts = { }
    private selectionList: ChopSelection[] = [ ]

    constructor() {
        super()

        this.selection.on('select', (selection) => {
            this.emit('select', selection)
            if(selection) this.buffer()
        })
    }

    async loadFiles(fileDir: PathLike) {
        this.files = [ ]

        this.setFileStatus({ loading: true })

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

        const summary = this.fileSummary()

        this.setFileStatus({ loading: false, summary })

        return summary
    }

    setFileStatus(status: ChopFileStatus) {
        this.status = status
        this.emit('fileStatus', status)
    }

    getFileStatus() {
        return this.status
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

        const buff = curr.buffer ?? await selectionToBuffer(curr.pos, curr_file)

        this.emit('buffer', buff)

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
}

type HistoryMessages<T> = new () => TypedEmitter<{ 'select': ( selection: T|null ) => void }>

class SelectionHistory extends (EventEmitter as HistoryMessages<ChopSelection>) {
    private history: ChopSelection[]
    private curr: number = -1

    constructor() { 
        super()
        this.history = []  
    }

    push(t: ChopSelection) {
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

    current(): ChopSelection|undefined {
        return this.history[this.curr]
    }

    emitSelection() {
        const curr = this.current() || null

        // this.selectionListeners.forEach((l) => l(curr))
        this.emit('select', curr)
    }
}