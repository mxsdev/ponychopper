import { ChopFileManager } from 'chops/chopManager';
import { globalShortcut } from 'electron'
import { IPCMainListen, IPCMainSend } from 'electron/ipc/ipcmain';
import { HotkeyId, HotkeyIDs, HotkeyList, hotkeyToString, isHotkeyComplete } from 'util/hotkeys';
import { UserSettingsManager } from './settings';
import { WindowManager } from './windows';

function getHotkeyHandler(id: HotkeyId, manager: ChopFileManager, windows: WindowManager) {
    switch(id) {
        case 'chop':
            return () => manager.chop()
        case 'next':
            return () => manager.next()
        case 'prev':
            return () => manager.prev()
        case 'play_pause':
            return () => IPCMainSend(windows.getMainWindow()?.webContents, 'playback_toggle_play')
        case 'replay':
            return () => IPCMainSend(windows.getMainWindow()?.webContents, 'playback_restart')
        default: 
            return () => { }
    }
}

function registerHotkeyList(hotkeys: HotkeyList, manager: ChopFileManager, windows: WindowManager) {
    const registered = HotkeyIDs.map(id => {
        const hotkey = hotkeys[id]
        if(!hotkey || !isHotkeyComplete(hotkey)) return null

        const handler = getHotkeyHandler(id, manager, windows)

        const accellerator = hotkeyToString(hotkey)

        try {
            globalShortcut.register(accellerator, handler)
        } catch(e) {
            console.error(`Failed to register the hotkey ${accellerator}`, e)
        }
        

        return accellerator
    })

    return () => registered
        .forEach((r) => !r || globalShortcut.unregister(r))
}

export function registerGlobalHotkeysIPC(settings: UserSettingsManager, manager: ChopFileManager, windows: WindowManager) {
    let _unregister: (() => void)|null = null

    const register = (list: HotkeyList) => {
        unregister()
        _unregister = registerHotkeyList(list, manager, windows)
    }

    const unregister = () => {
        _unregister?.()
        _unregister = null
    }

    if(settings.get('globalHotkeysEnabled')) {
        register(settings.get('globalHotkeys'))
    }

    settings.on('update', (update, old) => {
        if(update.globalHotkeysEnabled === false) {
            unregister()
            return
        }

        const ghEnabled = update.globalHotkeysEnabled || old.globalHotkeysEnabled

        const shouldRegister = update.globalHotkeysEnabled || (update.globalHotkeys && ghEnabled)

        if(shouldRegister) register(update.globalHotkeys ?? old.globalHotkeys)
    })
}