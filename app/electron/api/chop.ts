import { ChopFileManager } from 'chops/chopManager';
import fs from 'fs/promises'
import { exists } from "util/file";

const manager = new ChopFileManager()

export async function reloadChops(dir: string) {
    if(!(await exists(dir))) return 0
    if(!(await fs.stat(dir)).isDirectory()) return 0

    await manager.loadFiles(dir)

    return manager.numFiles()
}

export function chop() {
    return manager.chop()
}

export async function loadBuffer() {
    return manager.buffer()
}

export function prevChop() {
    manager.prev()
    return manager.buffer()
}

export function nextChop() {
    manager.next()
    return manager.buffer()
}

export function numFiles() {
    return manager.numFiles()
}