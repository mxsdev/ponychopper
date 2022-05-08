import EventEmitter from 'events';
import Store from 'electron-store'
import { IPCMainListen, IPCMainSend } from 'electron/ipc/ipcmain'
import type { JSONSchema } from 'json-schema-typed'
import { DEFAULT_CHOP_DIR, DEFAULT_SRC_DIR } from './directory'
import { WindowManager } from './windows'
import { TypedEmitterInstance } from 'util/emitter';
import { Hotkey, HotkeyIDs } from 'util/hotkeys';
import { HotkeyId } from 'util/hotkeys';

const ctrlOrCommand = process.platform === 'darwin' ? { meta: true } : { command: true }

const defaultHotkeys: { [index in HotkeyId]?: { local?: Hotkey, global?: Hotkey } } = {
    chop: { 
        local: { key: 'C' },
        global: { key: 'C', mod: { ...ctrlOrCommand, alt: true } }
    },
    next: {
        local: { key: 'ArrowRight' },
        global: { key: 'ArrowRight', mod: { ...ctrlOrCommand, alt: true } }
    },
    prev: {
        local: { key: 'ArrowLeft' },
        global: { key: 'ArrowLeft', mod: { ...ctrlOrCommand, alt: true } }
    },
    play_pause: {
        local: { key: 'Space' }
    },
    replay: {
        local: { key: 'R' },
        global: { key: 'R', mod: { ...ctrlOrCommand, alt: true } }
    },
    expand_left: {
        local: { key: 'ArrowLeft', mod: { ...ctrlOrCommand } }
    },
    expand_right: {
        local: { key: 'ArrowRight', mod: { ...ctrlOrCommand } }
    }
}

export type UserSettingsData = {
    srcDir: string,
    chopDir: string,

    localHotkeys: {
        [id in HotkeyId]?: Hotkey
    },

    globalHotkeys: {
        [id in HotkeyId]?: Hotkey
    },

    globalHotkeysEnabled: boolean
}

const hotkeyModSchema: { [index in keyof Required<Required<Hotkey>['mod']>]: JSONSchema} = {
    alt: { type: 'boolean' },
    control: { type: 'boolean'},
    meta: { type: 'boolean' },
    shift: { type: 'boolean' }
}

const hotkeySchema: { [index in keyof Required<Hotkey>]: JSONSchema} = {
    key: {
        type: 'string'
    },
    mod: {
        type: 'object',
        properties: hotkeyModSchema
    }
}

const hotkeySchemaProperties = HotkeyIDs.reduce((prev, curr) => ({
        ...prev,
        [curr]: {
            type: 'object',
            properties: hotkeySchema
        }
    }), 
    { } as { [index in HotkeyId]?: { type: 'object' } }
)

const hotkeySchemaDefault = (level: 'global'|'local') => HotkeyIDs.reduce((prev, curr) => ({
        ...prev,
        [curr]: defaultHotkeys[curr]?.[level]
    }), 
    { } as { [index in HotkeyId]?: Hotkey }
)


export class UserSettingsManager extends (EventEmitter as TypedEmitterInstance<{
    update: (update: Partial<UserSettingsData>, old: UserSettingsData) => void
}>) {
    store: Store<UserSettingsData>

    constructor(storeName: string) { 
        super() 

        this.store = new Store<UserSettingsData>({
            schema: {
                srcDir: {
                    type: 'string',
                    default: DEFAULT_SRC_DIR
                },
                chopDir: {
                    type: 'string',
                    default: DEFAULT_CHOP_DIR
                },
                
                localHotkeys: {
                    type: 'object',
                    properties: hotkeySchemaProperties,
                    default: hotkeySchemaDefault('local')
                },
                globalHotkeys: {
                    type: 'object',
                    properties: hotkeySchemaProperties,
                    default: hotkeySchemaDefault('global')
                },
                globalHotkeysEnabled: {
                    type: 'boolean',
                    default: false
                }
            },
            name: storeName,
        })
    }

    getSettings(): UserSettingsData {
        return ({
            srcDir: this.store.get('srcDir'),
            chopDir: this.store.get('chopDir'),
            localHotkeys: this.store.get('localHotkeys'),
            globalHotkeys: this.store.get('globalHotkeys'),
            globalHotkeysEnabled: this.store.get('globalHotkeysEnabled')
        })
    }

    get<T extends keyof UserSettingsData>(key: T) {
        return this.store.get(key)
    }

    update(update: Partial<UserSettingsData>) {
        const old_settings = this.getSettings()

        this.store.set(update)

        this.emit('update', update, old_settings)
    }

    registerSettingsIPC(windows: WindowManager) {
        IPCMainListen('ready', ({sender}, from) => {
            if(from !== 'settings') return
            IPCMainSend(sender, 'update_settings', this.getSettings())
        })
        
        IPCMainListen('update_settings', (event, update) => {
            this.update(update)
        })
 
        this.on('update', (update, old) => {
            windows.getAllWindows().forEach((win) => {
                IPCMainSend(win.webContents, 'update_settings', update)
            })
        })
    }
}