import { ipcRenderer } from "electron"
import { ELECTRON_CONFIG } from "electron/config"
import { loadChops, numFiles, chop, prevChop, nextChop, loadBuffer, addChopSelectionListener, removeChopSelectionListener, currentChop, filter } from "./chop"
import { defaultChopDirectory } from "./directory"

export default {
    setPinned: (pinned: boolean) => {
        ipcRenderer.send(
            ELECTRON_CONFIG.ipc_events.set_pinned,
            pinned
        )
    },

    loadChops, numFiles,
    chop, prevChop, nextChop,
    loadBuffer,
    addChopSelectionListener,
    removeChopSelectionListener,
    currentChop,
    filter,

    defaultChopDirectory
}