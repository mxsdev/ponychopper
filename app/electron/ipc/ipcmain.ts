import { BrowserWindow, ipcMain, IpcMainEvent, WebContents } from "electron";
import { IPCRendererEvents, IPCMainEvents } from "./ipcevents";

export function IPCMainListen<E extends keyof IPCRendererEvents>(channel: E, handler: (event: IpcMainEvent, ...args: IPCRendererEvents[E]) => void, once: boolean = false) {
    // @ts-expect-error
    !once ? ipcMain.on(channel, handler) : ipcMain.once(channel, handler)
}

export function IPCMainUnlisten<E extends keyof IPCRendererEvents>(channel: E, handler: (event: IpcMainEvent, ...args: IPCRendererEvents[E]) => void) {
    // @ts-expect-error
    ipcMain.removeListener(channel, handler)
}

export function IPCMainSend<E extends keyof IPCMainEvents>(contents: WebContents|undefined, channel: E, ...args: IPCMainEvents[E]) {
    contents?.send(channel, ...args)
}