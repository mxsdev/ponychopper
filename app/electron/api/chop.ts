import { ChopFileManager, ChopSelectionListener } from 'chops/chopManager';
import fs from 'fs/promises'
import { exists } from "util/file";

const manager = new ChopFileManager()

export async function loadChops(dir: string) {
    if(!(await exists(dir))) return null
    if(!(await fs.stat(dir)).isDirectory()) return null

    return await manager.loadFiles(dir)
}

export function filter(opts: FilterOpts) {
    return manager.filter(opts)
}

export function chop() {
    return manager.chop()
}

export async function loadBuffer() {
    return manager.buffer()
}

export function prevChop() {
    manager.prev()
}

export function nextChop() {
    manager.next()
}

export function numFiles() {
    return manager.numFiles()
}

export function currentChop() {
    return manager.current()
}

export function addChopSelectionListener(listener: ChopSelectionListener) {
    manager.addSelectionListener(listener)
}

export function removeChopSelectionListener(listener: ChopSelectionListener) {
    manager.removeSelectionListener(listener)
}

// export const addChopSelectionListener = manager.addSelectionListener
// export const removeChopSelectionListener = manager.removeSelectionListener