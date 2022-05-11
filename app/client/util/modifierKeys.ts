import { useOs } from "@mantine/hooks"
import { useEffect, useState } from "react"

export const useModifierKeys = () => {
    const os = useOs()

    const [ ctrlKey, setCtrlKey ] = useState<boolean>(false)
    const [ altKey, setAltKey ] = useState<boolean>(false)

    useEffect(() => {
        const listener = (evt: KeyboardEvent) => {
            setCtrlKey(os === 'macos' ? evt.metaKey : evt.ctrlKey)
            setAltKey(evt.altKey)
        }

        window.addEventListener('keydown', listener)
        window.addEventListener('keyup', listener)

        return () => {
            window.removeEventListener('keydown', listener)
            window.removeEventListener('keyup', listener)
        }
    }, [ os, setCtrlKey ])

    return {
        modMain: ctrlKey,
        modAlt: altKey
    }
}