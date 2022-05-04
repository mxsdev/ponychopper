import { ChopFileManager } from "chops/chopManager";
import fs from 'fs/promises'
import { exists } from "util/file";

const manager = new ChopFileManager()

export function reloadChops(dir: string) {
    return exists(dir)
        .then((v) => {
            if(!v) return 0

            return fs.stat(dir)
                .then((stats) => {
                    if(!stats.isDirectory()) return 0

                    return manager.loadFiles(dir)
                        .then(() => manager.numFiles())
                })
        })

    // if(!exists(dir)) return 0
    // if(!(await fs.stat(dir)).isDirectory()) return 0

    // await manager.loadFiles(dir)

    // return manager.numFiles()
}

export function chop() {
    manager.chop()
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