import { ipcRenderer } from "electron"
import { ELECTRON_CONFIG } from "electron/config"
import { IPCRendererSend } from "electron/ipc/ipcrenderer"
import { chop, prevChop, nextChop, filter, signalReady, beginDrag } from "./chop"

export default {
    setPinned: (pinned: boolean) => {
        IPCRendererSend('set_pinned', pinned)
    },

    toggleSettings: () => {
        IPCRendererSend('toggle_settings')
    },
    
    chop, prevChop, nextChop,
    filter, signalReady, beginDrag
}