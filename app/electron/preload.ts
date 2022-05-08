import { DispatchEvent } from 'client/event/events'
import { contextBridge, ipcRenderer } from 'electron'
import api from './api/api'
import { IPCRendererListen } from './ipc/ipcrenderer'

contextBridge.exposeInMainWorld('api', api)

IPCRendererListen('settingsWindow', (ev, opened) => {
    DispatchEvent('settings_window_status', { opened })
})

IPCRendererListen('update_settings', (ev, update) => {
    DispatchEvent('update_settings', { update })
})

IPCRendererListen('playback_toggle_play', (ev) => {
    DispatchEvent('playback_toggle_play', { })
})

IPCRendererListen('playback_restart', (ev) => {
    DispatchEvent('playback_restart', { })
})