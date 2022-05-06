import { app, BrowserWindow, ipcMain, contextBridge, globalShortcut, ipcRenderer } from 'electron'
import path from 'path'
import { ELECTRON_CONFIG } from './config'
import { ChopFileManager } from 'chops/chopManager'
import { ensure_exists } from 'util/file'
import { genDefaultChopDir, genDefaultSrcDir } from './folders'
import { registerChopManager } from './main/manager'
import { WindowManager } from './main/windows'

const DEFAULT_USER_DATA_DIR = path.resolve(app.getPath('userData'), 'ponychopper')

ensure_exists(genDefaultChopDir(DEFAULT_USER_DATA_DIR))
ensure_exists(genDefaultSrcDir(DEFAULT_USER_DATA_DIR))

const windowManager = new WindowManager()

app.whenReady().then(() => {
    const mainWindow = windowManager.createMainWindow()
    
    registerChopManager(ipcMain, windowManager)
})

// set pinned
ipcMain.on(ELECTRON_CONFIG.ipc_events.set_pinned, (event, pinned: boolean) => {
    BrowserWindow.getFocusedWindow()?.setAlwaysOnTop(pinned, 'pop-up-menu')
})

// ipcMain.on('ondragstart', (event, filePath) => {
//     event.sender.startDrag({
//         file: filePath,
//         icon: path.join(__dirname, 'horse.png')
//     })
// })

// ipcMain.on('onregisterglobalhotkeys', (event) => {
//     globalShortcut.unregisterAll()

//     globalShortcut.register('CommandOrControl+Shift+C', () => {
//         // if(win.isFocused()) return
//         win?.webContents.send('onchopkeypressed')
//     })

//     globalShortcut.register('CommandOrControl+Shift+R', () => {
//         win?.webContents.send('onreplaykeypressed')
//     })
// })

// ipcMain.on('onunregisterglobalhotkeys', (event) => {
//     globalShortcut.unregisterAll()
// })