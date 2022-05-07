import EventEmitter from 'events';
import Store from 'electron-store'
import { IPCMainListen, IPCMainSend } from 'electron/ipc/ipcmain'
import type { JSONSchema } from 'json-schema-typed'
import { DEFAULT_CHOP_DIR, DEFAULT_SRC_DIR } from './directory'
import { WindowManager } from './windows'
import { TypedEmitterInstance } from 'util/emitter';

export type UserSettingsData = {
    srcDir: string,
    chopDir: string,
}

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
                }
            },
            name: storeName,
        })
    }

    getSettings(): UserSettingsData {
        return ({
            srcDir: this.store.get<string, string>('srcDir'),
            chopDir: this.store.get<string, string>('chopDir')
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
            IPCMainSend(windows.getSettingsWindow()?.webContents, 'update_settings', this.getSettings())
        })
    }
}