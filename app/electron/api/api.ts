import { ipcRenderer } from "electron"
import { ELECTRON_CONFIG } from "electron/config"
import { IPCMainHandlers } from "electron/ipc/ipchandlers"
import { IPCRendererInvoke, IPCRendererSend } from "electron/ipc/ipcrenderer"
import { UserSettingsData } from "electron/main/settings"
import { chop, prevChop, nextChop, filter, signalReady, beginDrag, reloadFiles } from "./chop"

export default {
    setPinned: (pinned: boolean) => {
        IPCRendererSend('set_pinned', pinned)
    },

    toggleSettings: () => {
        IPCRendererSend('toggle_settings')
    },

    updateSettings: (update: Partial<UserSettingsData>) => {
        IPCRendererSend('update_settings', update)
    },

    getDirectory: (...args: Parameters<IPCMainHandlers['get_folder']>) => IPCRendererInvoke('get_folder', ...args),
    
    openLink: (url: string) => IPCRendererInvoke('open_external_link', url),

    chop, prevChop, nextChop,
    filter, signalReady, beginDrag,
    reloadFiles
}