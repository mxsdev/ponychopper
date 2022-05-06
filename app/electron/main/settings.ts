import Store from 'electron-store'
import type { JSONSchema } from 'json-schema-typed'
import { DEFAULT_CHOP_DIR, DEFAULT_SRC_DIR } from './directory'

export const UserSettings = new Store({
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
    name: 'usersettings',
})