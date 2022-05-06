import { ChopFileManager, ChopFileStatus } from 'chops/chopManager';
import { ChopSelection } from 'chops/chops';
import { ipcRenderer } from 'electron';
import { ELECTRON_CONFIG } from 'electron/config';
import fs from 'fs/promises'
import { exists } from "util/file";

// export async function loadChops(dir: string) {
//     if(!(await exists(dir))) return null
//     if(!(await fs.stat(dir)).isDirectory()) return null

//     return await manager.loadFiles(dir)
// }

export function beginDrag() {
    ipcRenderer.send(ELECTRON_CONFIG.ipc_events.drag_start)
}

export function filter(opts: FilterOpts) {
    ipcRenderer.send(ELECTRON_CONFIG.ipc_events.chop.filter, opts)
}

export function chop() {
    ipcRenderer.send(ELECTRON_CONFIG.ipc_events.chop.chop)
}

export function prevChop() {
    ipcRenderer.send(ELECTRON_CONFIG.ipc_events.chop.prev)
}

export function nextChop() {
    ipcRenderer.send(ELECTRON_CONFIG.ipc_events.chop.next)
}

export function signalReady() {
    ipcRenderer.send(ELECTRON_CONFIG.ipc_events.chop.ready)
}

// TODO: unify typings here

ipcRenderer.on(ELECTRON_CONFIG.web_events.chop.buffer, (event, buff: Buffer) => {
    if(!buff) return
    window.dispatchEvent(new CustomEvent(ELECTRON_CONFIG.window_events.chop.buffer, { detail: { buff } } ))
})

ipcRenderer.on(ELECTRON_CONFIG.web_events.chop.selection, (event, selection: ChopSelection|null) => {
    window.dispatchEvent(new CustomEvent(ELECTRON_CONFIG.window_events.chop.selection, { detail: { selection }}))
})

ipcRenderer.on(ELECTRON_CONFIG.web_events.chop.filesStatus, (event, status: ChopFileStatus) => {
    window.dispatchEvent(new CustomEvent(ELECTRON_CONFIG.window_events.chop.filesStatus, { detail: { status } }))
})

// export function addChopSelectionListener(listener: ChopSelectionListener) {
//     manager.addSelectionListener(listener)
// }

// export function removeChopSelectionListener(listener: ChopSelectionListener) {
//     manager.removeSelectionListener(listener)
// }

// export const addChopSelectionListener = manager.addSelectionListener
// export const removeChopSelectionListener = manager.removeSelectionListener