import { BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent, WebContents } from "electron";
import { IPCRendererEvents, IPCMainEvents } from "./ipcevents";
import { IPCMainHandlers } from "./ipchandlers";

export function IPCMainListen<E extends keyof IPCRendererEvents>(channel: E, handler: (event: IpcMainEvent, ...args: IPCRendererEvents[E]) => void, once: boolean = false) {
    // @ts-expect-error
    !once ? ipcMain.on(channel, handler) : ipcMain.once(channel, handler)

    return () => IPCMainUnlisten(channel, handler)
}

export function IPCMainUnlisten<E extends keyof IPCRendererEvents>(channel: E, handler: (event: IpcMainEvent, ...args: IPCRendererEvents[E]) => void) {
    // @ts-expect-error
    ipcMain.removeListener(channel, handler)
}

export function IPCMainSend<E extends keyof IPCMainEvents>(contents: WebContents|undefined, channel: E, ...args: IPCMainEvents[E]) {
    contents?.send(channel, ...args)
}

export function IPCMainHandle<C extends keyof IPCMainHandlers>(channel: C, handler: (event: IpcMainInvokeEvent, ...args: Parameters<IPCMainHandlers[C]>) => ReturnType<IPCMainHandlers[C]>, once?: boolean) {
    // @ts-expect-error
    !once ? ipcMain.handle(channel, handler) : ipcMain.handleOnce(channel, handler)

    return () => IPCMainUnhandle(channel)
}

export function IPCMainUnhandle<C extends keyof IPCMainHandlers>(channel: C) {
    ipcMain.removeHandler(channel)
}