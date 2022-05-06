import { useEffect } from "react"
import { useLocalStorage } from "./util/storage"

export const useSettings = () => {
    // register global hotkeys
    const [ globalMode, setGlobalMode ] = useLocalStorage<boolean>('globalMode', false)

    // pin
    const [ pinned, setPinned ] = useLocalStorage<boolean>('pinned', false)

    useEffect(() => {
        api.setPinned(pinned)
    }, [pinned])

    return {
        globalMode, setGlobalMode,
        pinned, setPinned
    }
}