import { ChopFileStatus } from "chops/chopManager"
import { ChopSelection, FilterOpts } from "chops/chops"
import { UserSettingsData } from "electron/main/settings"
import { WindowType } from "electron/main/windows"

type EventList<T extends { [key: string]: any[] }> = T

/**
 * Renderer --> Main
 */
export type IPCRendererEvents = EventList<{
    set_pinned: [ pinned: boolean ],
    drag_start: [ ],

    filter: [ opts: FilterOpts ],
    chop: [ ],
    next: [ ],
    prev: [ ],

    ready: [ from: WindowType ],
    
    toggle_settings: [ ],

    update_settings: [ settings: Partial<UserSettingsData> ]
}>

/**
 * Main --> Renderer
 */
export type IPCMainEvents = EventList<{
    buffer: [ buff: Buffer ],
    selection: [ sel: ChopSelection|null ],
    filesStatus: [ status: ChopFileStatus ],

    settingsWindow: [ opened: boolean ],

    update_settings: [ settings: Partial<UserSettingsData> ]

    playback_toggle_play: [],
    playback_restart: []
}>