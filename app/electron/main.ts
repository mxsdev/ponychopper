import { app, BrowserWindow, ipcMain, contextBridge, globalShortcut, ipcRenderer } from 'electron'
import path from 'path'
import { ELECTRON_CONFIG } from './config'
import { ChopFileManager } from 'chops/chopManager'

// create window
let win: BrowserWindow|null = null

function createWindow() {
    win = new BrowserWindow({
        width: ELECTRON_CONFIG.window.width + (DEV_MODE ? 300 : 0),
        height: ELECTRON_CONFIG.window.height,
        webPreferences: {
            preload: path.join(__dirname, DIST_PRELOAD)
        }
    })

    win.setMenuBarVisibility(false)

    if(DEV_MODE) {
        win.loadURL(path.join('http://localhost:8080', DIST_INDEX_HTML))
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, DIST_INDEX_HTML))
    }
    
}

app.whenReady().then(() => {
    createWindow()
    
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