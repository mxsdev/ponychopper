import { ChopFileStatus, FilterResult } from "chops/chopManager"
import { ChopSelection, FilterOpts } from "chops/chops"
import { UserSettingsData } from "electron/main/settings"

type EventList<T extends { [channel: string]: Record<string, any> }> = T

export type WindowEvents = EventList<{
    chop_buffer: {
        buff: Buffer
    },
    chop_selection: {
        selection: ChopSelection|null
    },
    chop_file_status: {
        status: ChopFileStatus
    },
    settings_window_status: {
        opened: boolean
    },
    update_settings: {
        update: Partial<UserSettingsData>
    },
    playback_toggle_play: { },
    playback_restart: { },
    set_filter: {
        filter: FilterOpts
    },
    filter_result: {
        result: FilterResult
    }
}>

export type PCEventListener<C extends keyof WindowEvents> = (event: CustomEvent<WindowEvents[C]>) => void

export function AddEventListener<C extends keyof WindowEvents>(channel: C, handler: PCEventListener<C>, options?: AddEventListenerOptions) {
    window.addEventListener(channel, handler as EventListener, options)

    // return (options?: EventListenerOptions) => RemoveEventListener(channel, handler)
}

export function RemoveEventListener<C extends keyof WindowEvents>(channel: C, handler: PCEventListener<C>, options?: EventListenerOptions) {
    window.removeEventListener(channel, handler as EventListener, options)
}

export function DispatchEvent<C extends keyof WindowEvents>(channel: C, detail: WindowEvents[C], options?: Omit<EventInit, 'detail'>) {
    return window.dispatchEvent(new CustomEvent(channel, { detail, ...options }))
}