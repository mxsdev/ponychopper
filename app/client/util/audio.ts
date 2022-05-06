import { AddEventListener, PCEventListener, RemoveEventListener } from "client/event/events"
import { ELECTRON_CONFIG } from "electron/config"
import { useEffect, useState } from "react"

export const useWaveSurfer = () => {
    const [ws, setWS] = useState<WaveSurfer|null>(null)

    const [ chopLoading, setChopLoading ] = useState<boolean>(false)

    const [ isPlaying, setIsPlaying ] = useState<boolean>(false)

    const startDrag = () => {
        api.beginDrag()
    }

    useEffect(() => {
        if(!ws) return

        const bufferListener: PCEventListener<'chop_buffer'> = (ev) => {
            ws?.loadBlob(new Blob([ev.detail.buff]))
        }

        AddEventListener('chop_buffer', bufferListener)

        const onEnd = () => setIsPlaying(false)
        const onStart = () => setIsPlaying(true)

        ws.on('play', onStart)
        ws.on('pause', onEnd)
        ws.on('finish', onEnd)

        return () => {
            RemoveEventListener('chop_buffer', bufferListener)

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