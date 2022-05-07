import { ChopFileManager } from "chops/chopManager";
import { app, BrowserWindow, ipcMain } from "electron";
import { ELECTRON_CONFIG } from "electron/config";
import { WindowManager } from "./windows";
import fs from 'fs'
import path from 'path'
import { IPCMainListen, IPCMainSend } from "electron/ipc/ipcmain";
import { UserSettingsManager } from "./settings";

export function registerChopManager(ipc: typeof ipcMain, windows: WindowManager, userSettings: UserSettingsManager) {
    const manager = new ChopFileManager()

    manager.loadFiles(userSettings.get('srcDir'))

    IPCMainListen('filter', (event, filter) => {
        if(!filter) return
        manager.filter(filter)
    })

    IPCMainListen('drag_start', (event) => {
        if(!manager.current()) return

        manager.writeFile(userSettings.get('chopDir'))
            .then((file) => {
                event.sender.startDrag({
                    file,
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
        IPCMainSend(event.sender, 'filesStatus', manager.getFileStatus())
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

    userSettings.on('update', ({srcDir}, {srcDir: oldSrcDir}) => {
        if(srcDir && srcDir !== oldSrcDir) {
            console.log(`Source directory changed to : ${srcDir}`)

            manager.loadFiles(srcDir)
        }
    })
}