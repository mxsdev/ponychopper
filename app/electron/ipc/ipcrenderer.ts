
import { BrowserWindow, ipcMain, IpcMainEvent, ipcRenderer, IpcRendererEvent } from "electron";
import { IPCRendererEvents, IPCMainEvents } from "./ipcevents";
import { IPCMainHandlers } from "./ipchandlers";

export function IPCRendererListen<E extends keyof IPCMainEvents>(channel: E, handler: (event: IpcRendererEvent, ...args: IPCMainEvents[E]) => void, once?: boolean) {
    // @ts-expect-error
    !once ? ipcRenderer.on(channel, handler) : ipcRenderer.once(channel, handler)

    return () => IPCRendererUnlisten(channel, handler)
}

export function IPCRendererUnlisten<E extends keyof IPCMainEvents>(channel: E, handler: (event: IpcRendererEvent, ...args: IPCMainEvents[E]) => void) {
    // @ts-expect-error
    ipcRenderer.removeListener(channel, handler)
}

export function IPCRendererSend<E extends keyof IPCRendererEvents>(channel: E, ...args: IPCRendererEvents[E]) {
    ipcRenderer.send(channel, ...args)
}

export function IPCRendererInvoke<C extends keyof IPCMainHandlers>(channel: C, ...args: Parameters<IPCMainHandlers[C]>): Promise<Awaited<ReturnType<IPCMainHandlers[C]>>> {
    return ipcRenderer.invoke(channel, args) as Promise<Awaited<ReturnType<IPCMainHandlers[C]>>>
}