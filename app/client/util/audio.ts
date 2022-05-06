import { ChopSelectionListener } from "chops/chopManager"
import { useEffect, useState } from "react"
import { compareSelections } from "util/selection"

export const useWaveSurfer = () => {
    const [ws, setWS] = useState<WaveSurfer|null>(null)

    const [ chopLoading, setChopLoading ] = useState<boolean>(false)

    const [ isPlaying, setIsPlaying ] = useState<boolean>(false)

    useEffect(() => {
        if(!ws) return

        const selListener: ChopSelectionListener = (val) => {
            if(!val) {
                ws.empty()
                return
            }

            console.log(val)

            setChopLoading(true)

            api.loadBuffer()
                .then((buff) => {
                    const curr = api.currentChop()

                    if(!curr || !(compareSelections(val, curr))) return
                    
                    ws.loadBlob(new Blob([buff]))
                })
                .catch((e) => {
                    console.error('Error loading chop buffer', e)
                })
                .finally(() => {
                    setChopLoading(false)
                })
        }

        api.addChopSelectionListener(selListener)

        const onEnd = () => setIsPlaying(false)
        const onStart = () => setIsPlaying(true)

        ws.on('play', onStart)
        ws.on('pause', onEnd)
        ws.on('finish', onEnd)

        return () => {
            api.removeChopSelectionListener(selListener)

            ws.un('play', onStart)
            ws.un('pause', onEnd)
            ws.un('finish', onEnd)
        }
    }, [ ws ])

    const controls = {
        playPause: () => ws?.playPause(),
        restart: () => ws?.play(0),
    }

    return { setWS, chopLoading, controls, isPlaying }
}