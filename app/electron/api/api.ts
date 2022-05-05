import { ipcRenderer } from "electron"
import { ELECTRON_CONFIG } from "electron/config"
import { reloadChops, numFiles, chop, prevChop, nextChop, loadBuffer } from "./chop"
import { defaultChopDirectory } from "./directory"

export default {
    setPinned: (pinned: boolean) => {
        ipcRenderer.send(
            ELECTRON_CONFIG.ipc_events.set_pinned,
            pinned
        )
    },

    reloadChops, numFiles,
    chop, prevChop, nextChop,
    loadBuffer,

    defaultChopDirectory
}