import { useEffect, useRef, useState } from "react";
import { Hotkey, hotkeyToString, isHotkeyComplete, keyboardEventToHotkey } from "util/hotkeys";

export function useHotkeyInput(hotkey?: Hotkey, setHotkey?: (hotkey: Hotkey) => void) {
    const [ partialHotkey, setPartialHotkey ] = useState<Hotkey|undefined>()

    const onKeyDown = (event: Pick<KeyboardEvent, 'repeat'|'key'|'getModifierState'>) => {
        if(event.repeat) return

        const hotkey = keyboardEventToHotkey(event)

        setPartialHotkey(hotkey)

        if(isHotkeyComplete(hotkey)) setHotkey?.(hotkey)
    }

    const reset = () => {
        setPartialHotkey(undefined)
    }

    const shownHotkey = partialHotkey ?? hotkey

    const hotkeyText = shownHotkey ? hotkeyToString(shownHotkey) : ''

    return { onKeyDown, hotkeyText, reset }
}