import { useEffect } from "react";
import { HotkeyIDs, HotkeyList, testKeyboardEvent } from "util/hotkeys";
import { type AudioControls } from "./audio";

type Actions = {
    controls: AudioControls, 
    chop: () => void,
    next: () => void,
    prev: () => void,
    expandSelection: (direction: 'left'|'right') => void
}

export const useLocalHotkeys = (hotkeys: HotkeyList, actions: Actions) => {
    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if(event.target) {
                if(event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement) {
                    return
                }
            }

            const hotkey = HotkeyIDs.find((id) => {
                const hk = hotkeys[id]
                if(!hk) return 

                return testKeyboardEvent(event, hk)
            })

            if(!hotkey) return

            switch(hotkey) {
                case 'chop':
                    actions.chop()
                    break
                case 'next':
                    actions.next()
                    break
                case 'prev':
                    actions.prev()
                    break
                case 'play_pause':
                    actions.controls.playPause()
                    break
                case 'replay':
                    actions.controls.restart()
                    break
                case 'expand_left':
                    actions.expandSelection('left')
                    break
                case 'expand_right':
                    actions.expandSelection('right')
                    break
            }
        }

        window.addEventListener('keydown', listener)

        return () => window.removeEventListener('keydown', listener)
    }, [hotkeys, actions])
}