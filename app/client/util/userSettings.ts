import { PCEventListener, AddEventListener, RemoveEventListener } from "client/event/events"
import { UserSettingsData } from "electron/main/settings"
import { useState, useEffect } from "react"

export const useUserSettings = () => {
    const [ userSettings, _setUserSettings ] = useState<UserSettingsData>({
        chopDir: '', srcDir: '',
        localHotkeys: { },
        globalHotkeys: { }
    })

    // listen for settings changes
    useEffect(() => {
        const settingsListener: PCEventListener<'update_settings'> = ({ detail: { update } }) => {
            _setUserSettings({
                ...userSettings,
                ...update
            })
        }

        AddEventListener('update_settings', settingsListener)

        // return () => {
        //     RemoveEventListener('update_settings', settingsListener)
        // }
    }, [])

    const updateSettings = (update: Partial<UserSettingsData>) => {
        api.updateSettings(update)
    }

    return { userSettings, updateSettings }
}

export const getDirectory = async (...args: Parameters<typeof api.getDirectory>) => api.getDirectory(...args).then(({canceled, filePaths}) => {
    if(canceled) return { action: 'cancelled' }
    if(filePaths.length === 0) return { action: 'select-none' }

    return { action: 'select', path: filePaths[0] }
})