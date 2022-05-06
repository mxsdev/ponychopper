import { app, BrowserWindow, ipcMain, contextBridge, globalShortcut, ipcRenderer } from 'electron'
import path from 'path'
import { ELECTRON_CONFIG } from './config'
import { ChopFileManager } from 'chops/chopManager'
import { ensure_exists } from 'util/file'
import { genDefaultChopDir, genDefaultSrcDir } from './folders'
import { registerChopManager } from './main/manager'
import { WindowManager } from './main/windows'
import { IPCMainListen } from './ipc/ipcmain'

const windowManager = new WindowManager()
windowManager.registerIPCListeners()

app.whenReady().then(() => {
    windowManager.createMainWindow()
    registerChopManager(ipcMain, windowManager)
})

// set pinned
IPCMainListen('set_pinned', (event, pinned) => {
    BrowserWindow.getFocusedWindow()?.setAlwaysOnTop(pinned, 'pop-up-menu')
})