import { type OpenDialogReturnValue } from "electron"

type HandlerList<T extends { [channel: string]: (...args: any[]) => Promise<any> }> = T

export type IPCMainHandlers = HandlerList<{
    get_folder: (opts?: { title?: string, defaultDirectory?: string }) => Promise<OpenDialogReturnValue>
}>