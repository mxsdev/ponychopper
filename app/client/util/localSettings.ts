import { AddEventListener, PCEventListener, RemoveEventListener } from "client/event/events"
import { useEffect, useState } from "react"
import { useLocalStorage } from "./storage"

export const useSettings = () => {
    // register global hotkeys
    const [ globalMode, setGlobalMode ] = useLocalStorage<boolean>('globalMode', false)

    // pin
    const [ pinned, setPinned ] = useLocalStorage<boolean>('pinned', false)

    const [ settingsOpened, setSettingsOpened ] = useState<boolean>(false)

    const toggleSettings = () => api.toggleSettings()

    useEffect(() => {
        api.setPinned(pinned)
    }, [pinned])

    useEffect(() => {
        const settingsListener: PCEventListener<'settings_window_status'> = ({detail: { opened }}) => {
            setSettingsOpened(opened)
        }

        AddEventListener('settings_window_status', settingsListener)

        return () => RemoveEventListener('settings_window_status', settingsListener)
    }, [])

    return {
        globalMode, setGlobalMode,
        pinned, setPinned,
        
        settingsOpened, toggleSettings
    }
}