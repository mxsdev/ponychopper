import { app, BrowserWindow, ipcMain, contextBridge, globalShortcut, ipcRenderer } from 'electron'
import path from 'path'
import { ELECTRON_CONFIG } from './config'
import { test } from 'chops/chopManager'

// create window
let win: BrowserWindow|null = null

function createWindow() {
    win = new BrowserWindow({
        width: 450,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, DIST_PRELOAD)
        }
    })

    win.loadFile(path.join(__dirname, DIST_INDEX_HTML))

    win.setMenuBarVisibility(false)

    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    console.log(test)

    // const audio_dir = path.join(__dirname, '../../../ponychopper-audio/')
    // await manager.loadFiles(audio_dir)
})

// ipcMain.on('ondragstart', (event, filePath) => {
//     event.sender.startDrag({
//         file: filePath,
//         icon: path.join(__dirname, 'horse.png')
//     })
// })

ipcMain.on(ELECTRON_CONFIG.ipc_events.set_pinned, (event, pinned: boolean) => {
    BrowserWindow.getFocusedWindow()?.setAlwaysOnTop(pinned, 'pop-up-menu')
})

ipcMain.handle(ELECTRON_CONFIG.ipc_functions.get_user_data, (event) => {
    return app.getPath('userData')
})

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