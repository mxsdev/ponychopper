
export const HotkeyIDs = [ 'play_pause', 'chop', 'prev', 'next', 'replay', 'expand_right', 'expand_left' ] as const

export type HotkeyId = typeof HotkeyIDs[number]

type HotkeyMeta = { [index in HotkeyId]: {
    label: string,
} }

export const hotkeys: HotkeyMeta = {
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

export type HotkeyList = { [index in HotkeyId]?: Hotkey }

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

function jsKeyToElectronKey(key: string): Electron.Accelerator {
    switch(key) {
        case ' ':
            return 'Space'
        case 'ArrowRight':
            return 'Right'
        case 'ArrowLeft':
            return 'Left'
        case 'ArrowDown':
            return 'Down'
        case 'ArrowUp':
            return 'Up'
        default:
            return key
    }
}

export function keyboardEventToHotkey(event: Pick<KeyboardEvent, 'key'|'getModifierState'>): Hotkey {
    const { key } = event

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
    const key = jsKeyToElectronKey(hotkey.key) as string

    if(modifierStack.length === 0) return key

    return `${modifierStr}+${key}`
}