import { app, BrowserWindow, ipcMain, contextBridge, globalShortcut, ipcRenderer } from 'electron'
import path from 'path'
import os from 'os'
import fs from 'fs'

// create window
let win: BrowserWindow|null = null

function createWindow() {
    win = new BrowserWindow({
        width: 450,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('./public/index.html')

    win.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
    createWindow()
})

ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({    
        file: filePath,
        icon: 'I:\\horse.png'
    })
})

ipcMain.on('onsetpinned', (event, pinned) => {
    BrowserWindow.getFocusedWindow()?.setAlwaysOnTop(pinned, 'pop-up-menu')
})

ipcMain.on('onregisterglobalhotkeys', (event) => {
    globalShortcut.unregisterAll()

    globalShortcut.register('CommandOrControl+Shift+C', () => {
        // if(win.isFocused()) return
        win?.webContents.send('onchopkeypressed')
    })

    globalShortcut.register('CommandOrControl+Shift+R', () => {
        win?.webContents.send('onreplaykeypressed')
    })
})

ipcMain.on('onunregisterglobalhotkeys', (event) => {
    globalShortcut.unregisterAll()
})