import { BrowserWindow } from "electron";
import { ELECTRON_CONFIG } from "electron/config";
import path from 'path'

export class WindowManager {
    private mainWindow: BrowserWindow|null = null
    private settingsWindow: BrowserWindow|null = null

    constructor() { }

    createMainWindow() {
        const win = new BrowserWindow({
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

        if(this.mainWindow) {
            this.mainWindow.close()
        }

        this.mainWindow = win
    
        return win
    }

    getAllWindows(): Set<BrowserWindow> {
        return new Set<BrowserWindow>(
            [this.mainWindow, this.settingsWindow]
                .filter(a => (a != null)) as BrowserWindow[]
        )
    }
    
    getMainWindow(): BrowserWindow|null {
        return this.mainWindow
    }
}