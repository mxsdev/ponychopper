import { AddEventListener, PCEventListener, RemoveEventListener } from "client/event/events"
import { ELECTRON_CONFIG } from "electron/config"
import { useEffect, useState } from "react"

export type AudioControls = ReturnType<typeof useWaveSurfer>['controls']

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

        const playPauseListener: PCEventListener<'playback_toggle_play'> = () => ws?.playPause()
        const restartListener: PCEventListener<'playback_restart'> = () => ws?.play(0)

        AddEventListener('playback_toggle_play', playPauseListener)
        AddEventListener('playback_restart', restartListener)

        const onEnd = () => setIsPlaying(false)
        const onStart = () => setIsPlaying(true)

        ws.on('play', onStart)
        ws.on('pause', onEnd)
        ws.on('finish', onEnd)

        return () => {
            RemoveEventListener('chop_buffer', bufferListener)
            RemoveEventListener('playback_toggle_play', playPauseListener)
            RemoveEventListener('playback_restart', restartListener)

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