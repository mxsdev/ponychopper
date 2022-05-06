import { ChopFileManager } from "chops/chopManager";
import { app, BrowserWindow, ipcMain } from "electron";
import { ELECTRON_CONFIG } from "electron/config";
import { WindowManager } from "./windows";
import fs from 'fs'
import path from 'path'
import { IPCMainListen, IPCMainSend } from "electron/ipc/ipcmain";
import { UserSettings } from "./settings";

export function registerChopManager(ipc: typeof ipcMain, windows: WindowManager) {
    const manager = new ChopFileManager()

    const srcDir = UserSettings.get<string, string>('srcDir')
    
    manager.loadFiles(srcDir)

    IPCMainListen('filter', (event, filter) => {
        if(!filter) return
        manager.filter(filter)
    })

    IPCMainListen('drag_start', (event) => {
        if(!manager.current()) return

        // TODO: move this code to manager class
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

    IPCMainListen('chop', (event) => {
        manager.chop()
    })

    IPCMainListen('next', (event) => {
        manager.next()
    })

    IPCMainListen('prev', (event) => {
        manager.prev()
    })

    IPCMainListen('ready', (event, from) => {
        if(from === 'main') {
            IPCMainSend(event.sender, 'filesStatus', manager.getFileStatus())
        }
    })

    manager.on('buffer', (buff) => {
        IPCMainSend(windows.getMainWindow()?.webContents, 'buffer', buff)
    })

    manager.on('select', (selection) => {
        IPCMainSend(windows.getMainWindow()?.webContents, 'selection', selection)
    })

    manager.on('fileStatus', (status) => {
        windows.getAllWindows().forEach(win => IPCMainSend(win.webContents, 'filesStatus', status))
    })
}