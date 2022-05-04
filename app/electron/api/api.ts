import { ipcRenderer } from "electron"
import { ELECTRON_CONFIG } from "electron/config"
import { chop, nextChop, prevChop, reloadChops } from "./chop"
import { defaultChopDirectory } from "./directory"

export default {
    setPinned: (pinned: boolean) => {
        ipcRenderer.send(
            ELECTRON_CONFIG.ipc_events.set_pinned,
            pinned
        )
    },

    reloadChops,
    // chop, prevChop, nextChop,

    defaultChopDirectory
}