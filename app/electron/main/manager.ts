import { ChopFileManager } from "chops/chopManager";
import { app, BrowserWindow, ipcMain } from "electron";
import { ELECTRON_CONFIG } from "electron/config";
import { WindowManager } from "./windows";
import fs from 'fs'
import path from 'path'
import { IPCMainHandle, IPCMainListen, IPCMainSend } from "electron/ipc/ipcmain";
import { UserSettingsManager } from "./settings";
import { ICON_HORSE } from "./static";

export function registerChopManager(ipc: typeof ipcMain, windows: WindowManager, userSettings: UserSettingsManager) {
    const manager = new ChopFileManager()

    manager.loadFiles(userSettings.get('srcDir'))

    IPCMainListen('filter', (event, filter) => {
        manager.filter(filter)
    })

    IPCMainListen('drag_start', (event) => {
        if(!manager.current()) return

        manager.writeFile(userSettings.get('chopDir'))
            .then((file) => {
                event.sender.startDrag({
                    file,
                    icon: ICON_HORSE[64]
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

    IPCMainListen('expand', (event, direction) => {
        manager.expand(direction)
    })

    IPCMainListen('ready', (event, from) => {
        IPCMainSend(event.sender, 'filesStatus', manager.getFileStatus())
        IPCMainSend(event.sender, 'set_filter', manager.getFilter())
        IPCMainSend(event.sender, 'filter_result', manager.getFilterResult())
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

    manager.on('setFilter', (filter) => {
        IPCMainSend(windows.getMainWindow()?.webContents, 'set_filter', filter)
    })

    manager.on('filterResult', (result) => {
        IPCMainSend(windows?.getMainWindow()?.webContents, 'filter_result', result)
    })

    userSettings.on('update', ({srcDir}, {srcDir: oldSrcDir}) => {
        if(srcDir && srcDir !== oldSrcDir) {
            manager.loadFiles(srcDir)
        }
    })

    IPCMainHandle('load_files', () => manager.loadFiles(userSettings.get('srcDir')))

    return manager
}