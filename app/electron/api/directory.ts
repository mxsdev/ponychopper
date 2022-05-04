import path from 'path'
import { app, ipcRenderer } from 'electron'
import { ELECTRON_CONFIG } from 'electron/config'

export function defaultChopDirectory() {
    return ipcRenderer.invoke(ELECTRON_CONFIG.ipc_functions.get_user_data)
        .then((res) => {
            if(typeof res !== 'string') return null
            return path.resolve(res, "ponychopper", "Source Audio")
        })
}