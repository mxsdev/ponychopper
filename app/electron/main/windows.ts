import EventEmitter from 'events';
import { BrowserWindow } from "electron";
import { ELECTRON_CONFIG } from "electron/config";
import path from 'path'
import { TypedEmitterInstance } from 'util/emitter';
import { IPCMainListen, IPCMainSend, IPCMainUnlisten } from 'electron/ipc/ipcmain';

export type WindowType = 'main'|'settings'

function createWindow(opts: { width: number, height: number, minWidth?: number, mode: WindowType, parent?: BrowserWindow, show?: boolean }): BrowserWindow {
    const DO_DEV_TOOLS = DEV_MODE && (opts.mode === 'main')

    const win = new BrowserWindow({
        width: opts.width + (DO_DEV_TOOLS ? 300 : 0),
        height: opts.height,
        minWidth: opts.minWidth,

        webPreferences: {
            preload: path.join(__dirname, DIST_PRELOAD)
        },
        parent: opts.parent,
        show: opts.show ?? true
    })

    win.setMenuBarVisibility(false)

    if(opts.mode === 'settings') {
        // win.setAlwaysOnTop(true, 'pop-up-menu')
        win.setResizable(false)
    }

    if(DEV_MODE) {
        const url = new URL(DIST_INDEX_HTML, 'http://localhost:8080')

        url.searchParams.set('settings', String(opts.mode === 'settings'))

        win.loadURL(url.href)
        if(DO_DEV_TOOLS) win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, DIST_INDEX_HTML), {
            query: {
                'settings': String(opts.mode === 'settings')
            }
        })
    }

    return win
}

export class WindowManager extends (EventEmitter as TypedEmitterInstance<{
    'window_status': (details: { type: WindowType, opened: boolean }) => void
}>) {
    private mainWindow: BrowserWindow|null = null
    private settingsWindow: BrowserWindow|null = null

    constructor() { 
        super() 
    }

    registerIPCListeners() {
        const settingsListener = ({opened}: {opened: boolean}) => {
            IPCMainSend(this.getMainWindow()?.webContents, 'settingsWindow', opened)
        }

        this.on('window_status', settingsListener)

        const readyListener = (_: any, mode: WindowType) => {
            if(mode === 'main') IPCMainSend(this.getMainWindow()?.webContents, 'settingsWindow', this.isSettingsWindowOpen())
        }

        IPCMainListen('ready', readyListener)

        const toggleListener = (_: any) => {
            this.toggleSettingsWindow()
        }

        IPCMainListen('toggle_settings', toggleListener)

        return () => {
            this.removeListener('window_status', settingsListener)
            IPCMainUnlisten('ready', readyListener)
            IPCMainUnlisten('toggle_settings', toggleListener)
        }
    }

    createMainWindow() {
        if(this.mainWindow) return this.mainWindow

        const win = createWindow({ 
            width: ELECTRON_CONFIG.window.main.width, 
            height: ELECTRON_CONFIG.window.main.height,
            minWidth: ELECTRON_CONFIG.window.main.minWidth,
            mode: 'main'
        })

        this.mainWindow = win
        this.emit('window_status', { type: 'main', opened: true })

        return win
    }

    createSettingsWindow() {
        if(this.settingsWindow) return this.settingsWindow

        const win = createWindow({
            width: ELECTRON_CONFIG.window.settings.width,
            height: ELECTRON_CONFIG.window.settings.height,
            mode: 'settings',
            parent: this.getMainWindow() ?? undefined,
            show: false
        })

        win.showInactive()
        win.setAlwaysOnTop(true, 'pop-up-menu')

        this.settingsWindow = win
        this.emit('window_status', { type: 'settings', opened: true })

        this.settingsWindow.on('closed', () => {
            if(win === this.settingsWindow) {
                this.settingsWindow = null
                this.emit('window_status', { type: 'settings', opened: false })
            }
        })

        return win
    }

    closeSettingsWindow() {
        if(!this.settingsWindow) return

        if(this.settingsWindow.isClosable()) {
            this.settingsWindow.close()
        } else {
            this.settingsWindow.destroy()
        }

        this.emit('window_status', { type: 'settings', opened: false })
        this.settingsWindow = null
    }

    toggleSettingsWindow() {
        if(this.isSettingsWindowOpen()) {
            this.closeSettingsWindow()
        } else {
            this.createSettingsWindow()
        }
    }

    isSettingsWindowOpen() {
        return !!this.settingsWindow
    }

    getAllWindows(): Set<BrowserWindow> {
        return new Set<BrowserWindow>(
            [this.mainWindow, this.settingsWindow]
                .filter(a => (a != null)) as BrowserWindow[]
        )
    }
    
    getMainWindow() { return this.mainWindow }

    getSettingsWindow() { return this.settingsWindow }

    findWindow(id: number) {
        return [...this.getAllWindows()].find((win) => win.webContents.id === id)
    }
}