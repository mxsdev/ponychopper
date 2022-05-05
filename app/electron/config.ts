export const ELECTRON_CONFIG = {
    window: {
        width: 450,
        height: 850
    },
    ipc_events: {
        set_pinned: 'onsetpinned',
        register_global_hotkeys: 'onregisterglobalhotkeys',
        unregister_global_hotkeys: 'onunregisterglobalhotkeys',
        drag_start: 'ondragstart'
    },
    ipc_functions: {
        get_user_data: 'getuserdata'
    },
    // dev_mode: process.env.NODE_ENV === 'development'
}