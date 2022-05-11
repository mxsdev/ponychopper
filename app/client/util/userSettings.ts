import { PCEventListener, AddEventListener, RemoveEventListener } from "client/event/events"
import { UserSettingsData } from "electron/main/settings"
import { useState, useEffect } from "react"
import { Hotkey, HotkeyId } from "util/hotkeys"
import { useEvent } from "./event"

export const useUserSettings = () => {
    const [ userSettings, _setUserSettings ] = useState<UserSettingsData>({
        chopDir: '', srcDir: '',
        localHotkeys: { },
        globalHotkeys: { },
        globalHotkeysEnabled: false
    })

    // listen for settings changes
    useEvent('update_settings', ({ detail: { update } }) => {
        _setUserSettings((val) => ({
            ...val,
            ...update
        }))
    })

    const updateSettings = (update: Partial<UserSettingsData>) => {
        api.updateSettings(update)

        // optimistic updates
        _setUserSettings({
            ...userSettings,
            ...update
        })
    }

    const setDirectory = (type: 'src'|'chop') => getDirectory()
        .then(({path}) => {
            if(!path) return

            if(type === 'src') updateSettings({ srcDir: path })
            if(type === 'chop') updateSettings({chopDir: path})
        })

    const setHotkey = (type: 'global'|'local', id: HotkeyId, hk?: Hotkey) => {
        const key = (() => {
            switch(type) {
                case 'global':
                    return 'globalHotkeys'
                case 'local':
                    return 'localHotkeys'
            }
        })()

        updateSettings({ [ key ]: {
            ...userSettings[key],
            [id]: hk
        } })
    }

    return { userSettings, updateSettings, setDirectory, setHotkey }
}

export const getDirectory = async (...args: Parameters<typeof api.getDirectory>) => api.getDirectory(...args).then(({canceled, filePaths}) => {
    if(canceled) return { action: 'cancelled' }
    if(filePaths.length === 0) return { action: 'select-none' }

    return { action: 'select', path: filePaths[0] }
})