import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import { isDesktop } from "util/desktop"
import { compareSelections } from "util/selection"
import { COL_PRIMARY } from "client/ui/colors"

type Props = {
    setWS: (ws: WaveSurfer) => void,
    chopLoading: boolean,
    onDragStart?: () => void,
    className?: string
}

export const WaveForm: FunctionComponent<Props> = ({ setWS, chopLoading, onDragStart: _onDragStart, className }) => {
    const [showChopLoading, setShowChopLoading] = useState<boolean>(false)

    useEffect(() => {
        if(!chopLoading) {
            setShowChopLoading(false)
        } else {
            let timeout = setTimeout(() => setShowChopLoading(true), 300)
            return () => clearTimeout(timeout)
        }
    }, [chopLoading])

    const divRender = useCallback((node: HTMLDivElement) => {
        const waveshaper = WaveSurfer.create({
            container: `#${node.id}`,
            barWidth: 4,
            cursorWidth: 1,
            backend: 'WebAudio',
            barHeight: 3,

            height: 150,
            progressColor: COL_PRIMARY[4],
            waveColor: '#EFEFEF',

            cursorColor: 'transparent',
            hideScrollbar: true
        })

        setWS(waveshaper)   
        
        waveshaper.on('ready', function () {
            waveshaper.play()
        })
    }, [])

    const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()

        if(!showChopLoading && !chopLoading) {
            _onDragStart?.()
        }
    }

    return (<>
        <div id="waveform" 
            ref={divRender}
            className={className}
            draggable={true}
            onDragStart={onDragStart}>
                {showChopLoading ? <></> : <></> }        
        </div>
    </>)
}