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