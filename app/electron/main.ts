import { app, BrowserWindow, ipcMain, contextBridge, globalShortcut, ipcRenderer, dialog, shell } from 'electron'
import path from 'path'
import { ELECTRON_CONFIG } from './config'
import { ChopFileManager } from 'chops/chopManager'
import { ensure_exists } from 'util/file'
import { genDefaultChopDir, genDefaultSrcDir } from './folders'
import { registerChopManager } from './main/manager'
import { WindowManager } from './main/windows'
import { IPCMainHandle, IPCMainListen } from './ipc/ipcmain'
import { UserSettingsManager } from './main/settings'
import { registerGlobalHotkeysIPC } from './main/globalHotkeys'

const windowManager = new WindowManager()
windowManager.registerIPCListeners()

export const userSettings = new UserSettingsManager('usersettings')

app.whenReady().then(() => {
    windowManager.createMainWindow()

    const chopFileManager = registerChopManager(ipcMain, windowManager, userSettings)
    userSettings.registerSettingsIPC(windowManager)

    registerGlobalHotkeysIPC(userSettings, chopFileManager, windowManager)
})

// set pinned
IPCMainListen('set_pinned', (event, pinned) => {
    BrowserWindow.getFocusedWindow()?.setAlwaysOnTop(pinned, 'pop-up-menu')
})

// get folder
IPCMainHandle('get_folder', (event, opts) => {
    const windowFrom = windowManager.findWindow(event.sender.id)
    if(!windowFrom) throw new Error('Window not found')

    const defaultDirectory = opts?.type === "chop" ? userSettings.get('chopDir') : opts?.type === "src" ? userSettings.get('srcDir') : undefined

    return dialog.showOpenDialog(windowFrom, {
        properties: [ 'openDirectory' ],
        title: opts?.title,
        defaultPath: opts?.defaultDirectory ?? defaultDirectory,
    })
})

// open external link
IPCMainHandle('open_external_link', async (_, url) => {
    return shell.openExternal(url)
})