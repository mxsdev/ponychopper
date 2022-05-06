import { ChopFileManager } from "chops/chopManager";
import type { BrowserWindow, ipcMain } from "electron";
import { ELECTRON_CONFIG } from "electron/config";
import { WindowManager } from "./windows";
import fs from 'fs'
import path from 'path'

export function registerChopManager(ipc: typeof ipcMain, windows: WindowManager) {
    const manager = new ChopFileManager()

    ipc.on(ELECTRON_CONFIG.ipc_events.chop.filter, (event, filter: FilterOpts|undefined) => {
        if(!filter) return
        manager.filter(filter)
    })

    ipc.on(ELECTRON_CONFIG.ipc_events.drag_start, (event) => {
        console.log('got here xdxd')

        if(!manager.current()) return

        manager.buffer()
            .then(async (buff) => {
                const fname = path.join('/Users/maxstoumen/Music/choptest', 'test.wav')

                await fs.promises.writeFile(fname, buff)

                return fname
            })
            .then((fname) => {
                event.sender.startDrag({
                    file: fname,
                    icon: '/Users/maxstoumen/Projects/ponychopper/assets/horse.png'
                })
            })
    })

    ipc.on(ELECTRON_CONFIG.ipc_events.chop.chop, (event) => {
        manager.chop()
    })

    ipc.on(ELECTRON_CONFIG.ipc_events.chop.next, (event) => {
        manager.next()
    })

    ipc.on(ELECTRON_CONFIG.ipc_events.chop.prev, (event) => {
        manager.prev()
    })

    ipc.on(ELECTRON_CONFIG.ipc_events.chop.ready, (event) => {
        // TODO: make this better...
        manager.loadFiles('/Users/maxstoumen/Projects/ponychopper-audio')
    })

    manager.on('buffer', (buff) => {
        windows.getMainWindow()?.webContents.send(ELECTRON_CONFIG.web_events.chop.buffer, buff)
    })

    manager.on('select', (selection) => {
        windows.getMainWindow()?.webContents.send(ELECTRON_CONFIG.web_events.chop.selection, selection)
    })

    manager.on('fileStatus', (status) => {
        windows.getAllWindows().forEach(win => win.webContents.send(ELECTRON_CONFIG.web_events.chop.filesStatus, status))
    })

    // ipc.on(ELECTRON_CONFIG.ipc_events.chop.)
}