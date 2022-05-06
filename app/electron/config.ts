export const ELECTRON_CONFIG = {
    window: {
        width: 450,
        height: 850
    },
    ipc_events: {
        set_pinned: 'onsetpinned',
        register_global_hotkeys: 'onregisterglobalhotkeys',
        unregister_global_hotkeys: 'onunregisterglobalhotkeys',
        drag_start: 'ondragstart',

        chop: {
            filter: 'filter',
            chop: 'chop',
            next: 'next',
            prev: 'prev',
            ready: 'ready'
        }
    },
    ipc_functions: {
        get_buffer: 'current_buffer'
    },
    web_events: {
        chop: {
            buffer: 'buffer',
            selection: 'selection',
            filesStatus: 'filesStatus'
        }
    },
    window_events: {
        chop: {
            buffer: 'chopBuffer',
            selection: 'chopSelection',
            filesStatus: 'chopFilesStatus'
        }
    }
    // dev_mode: process.env.NODE_ENV === 'development'
}
