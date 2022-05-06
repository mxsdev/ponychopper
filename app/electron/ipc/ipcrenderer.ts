
import { BrowserWindow, ipcMain, IpcMainEvent, ipcRenderer, IpcRendererEvent } from "electron";
import { IPCRendererEvents, IPCMainEvents } from "./ipcevents";

export function IPCRendererListen<E extends keyof IPCMainEvents>(channel: E, handler: (event: IpcRendererEvent, ...args: IPCMainEvents[E]) => void, once?: boolean) {
    // @ts-expect-error
    !once ? ipcRenderer.on(channel, handler) : ipcRenderer.once(channel, handler)
}

export function IPCRendererUnlisten<E extends keyof IPCMainEvents>(channel: E, handler: (event: IpcRendererEvent, ...args: IPCMainEvents[E]) => void) {
    // @ts-expect-error
    ipcRenderer.removeListener(channel, handler)
}

export function IPCRendererSend<E extends keyof IPCRendererEvents>(channel: E, ...args: IPCRendererEvents[E]) {
    ipcRenderer.send(channel, ...args)
}