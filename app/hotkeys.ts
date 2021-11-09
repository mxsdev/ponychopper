import config from "config"

type Listener = (event: Event) => void

function space(ws: WaveSurfer|null) {
    ws?.playPause()
}

function replay(ws: WaveSurfer|null) {
    ws?.play(0)
}

const chop = (ws: WaveSurfer|null) => {
    return (event: EventListenerOrEventListenerObject) => {
        console.log('onchopkeypressed RECEIVED in hotkeys.ts')
    }
}

let chopListener: Listener|null = null
let replayListener: Listener|null = null

export const registerHotkeys = ({ ws, chop }: { ws: WaveSurfer|null, chop: () => void }) => {
    window.onkeydown = (event) => {
        switch(event.key) {
            case " ":
                space(ws)
                event.preventDefault()    
                break
            case "r":
                // replay(ws)
                window.dispatchEvent(new Event('onreplaykeypressed'))
                event.preventDefault()  
                break
            case "c":
                window.dispatchEvent(new Event('onchopkeypressed'))
                event.preventDefault()
                break
            case "d":
                if(event.ctrlKey) {
                    console.log("download key")

                    event.preventDefault()
                }

                break
        }
    }

    chopListener = (event) => chop()
    window.addEventListener('onchopkeypressed', chopListener)

    replayListener = (event) => ws?.play(0)
    window.addEventListener('onreplaykeypressed', replayListener)
}

export const unregisterHotkeys = () => {
    window.onkeydown = null

    if(chopListener) window.removeEventListener('onchopkeypressed', chopListener)
    if(replayListener) window.removeEventListener('onreplaykeypressed', replayListener)
}

export const registerGlobalHotkeys = ({ ws, chop }: { ws: WaveSurfer|null, chop: () => void }) => {
    if(!config.desktop) return
    // @ts-ignore
    window.electron.registerGlobalHotkeys()
}

export const unregisterGlobalHotkeys = () => {
    if(!config.desktop) return

    // @ts-ignore
    window.electron.unregisterGlobalHotkeys()
}