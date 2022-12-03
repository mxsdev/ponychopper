import { ChopFileStatus } from "chops/chopManager"
import { ChopFileSummary } from "chops/chops"
import { type OpenDialogReturnValue } from "electron"

type HandlerList<T extends { [channel: string]: (...args: any[]) => Promise<any> }> = T

export type IPCMainHandlers = HandlerList<{
    get_folder: (opts?: { title?: string, defaultDirectory?: string, type?: 'chop'|'src' }) => Promise<OpenDialogReturnValue>,
    load_files: () => Promise<ChopFileSummary>,
    open_external_link: (link: string) => Promise<void>
}>