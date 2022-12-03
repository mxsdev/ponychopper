import type { PathLike } from 'fs'
import { getWaveMeta, WaveMeta } from '../util/riff'
import { exists, getFilesRecursively, withHandle } from '../util/file'
import { arrayRandom, randomInteger } from '../util/random'
import { range } from '../util/range'
import { ChopFile, ChopSelection, regionContains, regionUnion, fragmentsToSelection, waveMetaToChopFile, selectionToBuffer,  createChopSelectorGenerator, FilterOpts, chopFileSummary, ChopFileSummary, ChopSelector, ChopSelectorGenerator, expandSelection, NUMBER_TO_PITCH, chopSelectionFilenameBase } from './chops'
import path from 'path'
import fs from 'fs'
import EventEmitter from 'events'
import TypedEmitter from "typed-emitter"
import { TypedEmitterInstance } from 'util/emitter'
import shortid from 'short-uuid'
import { defaultFilter } from './filter'

export async function createChopFileManager(fileDir: PathLike) {
    const manager = new ChopFileManager()

    await manager.loadFiles(fileDir)

    return manager
}

export type ChopFileStatus = {
    loading: boolean,
    summary?: ChopFileSummary
}

export type FilterResult = {
    amount: number
}

type ChopFileManagerMessages = {
    'select': (selection: ChopSelection|null) => void,
    'buffer': (buffer: Buffer) => void,
    'fileStatus': (status: ChopFileStatus) => void,
    'setFilter': (filterOpts: FilterOpts) => void,
    'filterResult': (filterResult: FilterResult) => void
}

export class ChopFileManager extends (EventEmitter as TypedEmitterInstance<ChopFileManagerMessages>) {
    private files: ChopFile[] = [ ]

    private selection = new SelectionHistory()

    private status: ChopFileStatus = { loading: false }

    private selectorGenerator: ChopSelectorGenerator|null = null
    private selector: ChopSelector|null = null

    private filterOpts: FilterOpts = { }
    // private selectionList: ChopSelection[] = [ ]

    private uuid = shortid()

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

            await withHandle(fs.promises.open(f, 'r'), async (handle) => {
                const { size } = await handle.stat()
                const meta = await getWaveMeta(handle, size)

                // const location = path.relative(folder, f)

                const cf = waveMetaToChopFile(meta, f)

                this.files.push(cf)
            }).catch((e) => {
                console.error(`Failure reading wave file ${path.basename(f)}`, e)
            })
        }))

        this.empty()
        this.selectorGenerator = createChopSelectorGenerator(this.files)

        const summary = this.fileSummary()

        this.filter(defaultFilter(summary))

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
        this.emit('setFilter', opts)

        let numSelected = 0

        if(this.selectorGenerator) {
            this.selector = this.selectorGenerator(opts)
            numSelected = this.getFilterResult().amount
        }

        this.emit('filterResult', { amount: numSelected })

        return numSelected
    }

    getSelectionList(): ChopSelection[] {
        return this.selector?.getSelections() ?? []
    }

    getFilter(): FilterOpts {
        return this.filterOpts
    }

    getFilterResult(): FilterResult {
        return { amount: this.numSelections() }
    }

    current(): ChopSelection|undefined {
        return this.selection.current()
    }

    currentFile(): PathLike|undefined {
        const curr = this.current()
        if(!curr) return undefined

        return this.files[curr.fileIndex]?.location
    }

    async buffer(emit: boolean = true): Promise<Buffer> {
        const curr = this.current()
        const curr_file = this.currentFile()

        if(!curr || !curr_file) throw new Error('Cannot get buffer without selection')

        const buff = curr.buffer ?? await selectionToBuffer(curr.pos, curr_file)

        if(emit) this.emit('buffer', buff)

        curr.buffer = buff

        return buff
    }

    // TODO: move this to another file
    async writeFile(dir: string) {
        const curr = this.current()

        if(!curr) throw new Error('No selection!')

        const old_file = curr.file

        if(old_file) {
            const old_file_exists = await exists(old_file)
            if(old_file_exists) return old_file
        }

        const filename_base = chopSelectionFilenameBase(curr)

        let exists_index = 0

        const get_filename = () => `${filename_base}${exists_index ? `_${exists_index}` : ''}.wav`

        while(await exists(path.join(dir, get_filename()))) {
            exists_index++
        }

        const buff = await this.buffer(false)

        const filepath = path.join(dir, get_filename())

        await fs.promises.writeFile(filepath, buff)

        curr.file = filepath

        return filepath
    }

    numSelections() {
        return this.getSelectionList().length
    }

    chop(): ChopSelection|null {
        const sel = this.selector?.select()

        if(sel) this.selection.push(sel)

        return sel ?? null
    }

    prev() {
        this.selection.prev()
        return this.current()
    }

    next() {
        this.selection.next()
        return this.current()
    }

    expand(direction: 'right'|'left') {
        const curr = this.current()
        if(!curr) return

        this.selection.push(expandSelection(curr, direction))
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
