import { ChopFileManager, ChopFileStatus } from 'chops/chopManager';
import { ChopSelection, FilterOpts } from 'chops/chops';
import { DispatchEvent } from 'client/event/events';
import { ipcRenderer } from 'electron';
import { ELECTRON_CONFIG } from 'electron/config';
import { IPCRendererInvoke, IPCRendererListen, IPCRendererSend } from 'electron/ipc/ipcrenderer';
import { WindowType } from 'electron/main/windows';
import fs from 'fs/promises'
import { exists } from "util/file";

// export async function loadChops(dir: string) {
//     if(!(await exists(dir))) return null
//     if(!(await fs.stat(dir)).isDirectory()) return null

//     return await manager.loadFiles(dir)
// }

export function beginDrag() {
    IPCRendererSend('drag_start')
}

export function filter(opts: FilterOpts) {
    IPCRendererSend('filter', opts)
}

export function chop() {
    IPCRendererSend('chop')
}

export function prevChop() {
    IPCRendererSend('prev')
}

export function nextChop() {
    IPCRendererSend('next')
}

export function signalReady(from: WindowType) {
    IPCRendererSend('ready', from)
}

export function reloadFiles() {
    return IPCRendererInvoke('load_files')
}

IPCRendererListen('buffer', (event, buff: Buffer) => {
    if(!buff) return
    DispatchEvent('chop_buffer', { buff })
})

IPCRendererListen('selection', (event, selection: ChopSelection|null) => {
    DispatchEvent('chop_selection', { selection })
})

IPCRendererListen('filesStatus', (event, status: ChopFileStatus) => {
    DispatchEvent('chop_file_status', { status })
})

// export function addChopSelectionListener(listener: ChopSelectionListener) {
//     manager.addSelectionListener(listener)
// }

// export function removeChopSelectionListener(listener: ChopSelectionListener) {
//     manager.removeSelectionListener(listener)
// }

// export const addChopSelectionListener = manager.addSelectionListener
// export const removeChopSelectionListener = manager.removeSelectionListener