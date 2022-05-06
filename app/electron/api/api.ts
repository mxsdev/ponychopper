import { ipcRenderer } from "electron"
import { ELECTRON_CONFIG } from "electron/config"
import { chop, prevChop, nextChop, filter, signalReady, beginDrag } from "./chop"

export default {
    setPinned: (pinned: boolean) => {
        ipcRenderer.send(
            ELECTRON_CONFIG.ipc_events.set_pinned,
            pinned
        )
    },
    
    chop, prevChop, nextChop,
    filter, signalReady, beginDrag
}