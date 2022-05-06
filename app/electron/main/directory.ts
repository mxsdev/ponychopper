import path from 'path'
import { app, ipcMain } from 'electron'
import { ensure_exists } from 'util/file'
import { genDefaultChopDir, genDefaultSrcDir } from 'electron/folders'

export const DEFAULT_USER_DATA_DIR = path.resolve(app.getPath('userData'), 'ponychopper')

export const DEFAULT_SRC_DIR = genDefaultSrcDir(DEFAULT_USER_DATA_DIR)
export const DEFAULT_CHOP_DIR = genDefaultChopDir(DEFAULT_USER_DATA_DIR)

try {
    ensure_exists(DEFAULT_SRC_DIR)
    ensure_exists(DEFAULT_CHOP_DIR)
} catch(e) {
    console.error("Failed to ensure existence of default directories", e)
} 