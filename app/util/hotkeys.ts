
export const HotkeyIDs = [ 'play_pause', 'chop', 'prev', 'next', 'replay', 'expand_right', 'expand_left' ] as const

export type HotkeyId = typeof HotkeyIDs[number]

type HotkeyList = { [index in HotkeyId]: {
    label: string,
    // defaultLocalHotkey?: Hotkey,
    // defaultGlobalHotkey?: Hotkey
} }

export const hotkeys: HotkeyList = {
    play_pause: {
        label: 'Play/Pause',
    },
    chop: {
        label: 'Chop',
    },
    prev: {
        label: 'Previous Chop'
    },
    next: {
        label: 'Next Chop'
    },
    replay: {
        label: 'Replay'
    },
    expand_left: {
        label: 'Expand Left'
    },
    expand_right: {
        label: 'Expand Right'
    }
}

export type Hotkey = {
    mod?: {
        meta?: boolean,
        alt?: boolean,
        control?: boolean,
        shift?: boolean
    },
    key?: string
}

function isKeyComplete(key: string): boolean {
    return !!key && !(key === 'Meta' 
        || key === 'Alt' 
        || key === 'Control' 
        || key === 'Shift' )
}

export function keyboardEventToHotkey(event: Pick<KeyboardEvent, 'key'|'getModifierState'>): Hotkey {
    let key = event.key

    if(key === ' ') key = 'Space'

    const singleKey = key.length === 1

    const complete = isKeyComplete(key)

    return ({
        mod: {
            meta: event.getModifierState('Meta'),
            alt: event.getModifierState('Alt'),
            control: event.getModifierState('Control'),
            shift: event.getModifierState('Shift')
        },
        ...(complete ? { key: singleKey ? key.toUpperCase() : key } : {})
    })
}

function compareHotkeys(h1: Hotkey, h2: Hotkey) {
    return (h1.key === h2.key
            && !!h1.mod?.alt === !!h2.mod?.alt
            && !!h1.mod?.control === !!h2.mod?.control
            && !!h1.mod?.meta === !!h2.mod?.meta
            && !!h1.mod?.shift === !!h2.mod?.shift)
}

export function testKeyboardEvent(event: KeyboardEvent, hotkey: Hotkey) {
    return compareHotkeys(keyboardEventToHotkey(event), hotkey)
}

export function isHotkeyComplete(hotkey: Hotkey) {
    return !!hotkey.key
}

export function hotkeyToString(hotkey: Hotkey): string {
    const modifierStack: string[] = [ ]

    if(hotkey.mod?.alt) modifierStack.push('Alt')
    if(hotkey.mod?.control) modifierStack.push('Control')
    if(hotkey.mod?.meta) modifierStack.push('Command')
    if(hotkey.mod?.shift) modifierStack.push('Shift')

    const modifierStr = modifierStack.join('+')

    if(!hotkey.key) return modifierStr
    if(modifierStack.length === 0) return hotkey.key

    return `${modifierStr}+${hotkey.key}`
}