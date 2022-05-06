import { ELECTRON_CONFIG } from "electron/config"
import { useEffect, useState } from "react"

export const useWaveSurfer = () => {
    const [ws, setWS] = useState<WaveSurfer|null>(null)

    const [ chopLoading, setChopLoading ] = useState<boolean>(false)

    const [ isPlaying, setIsPlaying ] = useState<boolean>(false)

    const startDrag = () => {
        console.log('audio.ts: startDrag called')

        api.beginDrag()
    }

    useEffect(() => {
        if(!ws) return

        const bufferListener = ((ev: CustomEvent<{ buff: Buffer }>) => {
            ws?.loadBlob(new Blob([ev.detail.buff]))
        }) as EventListener

        window.addEventListener(
            ELECTRON_CONFIG.window_events.chop.buffer,
            bufferListener
        )

        const onEnd = () => setIsPlaying(false)
        const onStart = () => setIsPlaying(true)

        ws.on('play', onStart)
        ws.on('pause', onEnd)
        ws.on('finish', onEnd)

        return () => {
            window.removeEventListener(
                ELECTRON_CONFIG.window_events.chop.buffer, 
                bufferListener
            )

            ws.un('play', onStart)
            ws.un('pause', onEnd)
            ws.un('finish', onEnd)
        }
    }, [ ws ])

    const controls = {
        playPause: () => ws?.playPause(),
        restart: () => ws?.play(0),
    }

    return { setWS, chopLoading, controls, isPlaying, startDrag }
}