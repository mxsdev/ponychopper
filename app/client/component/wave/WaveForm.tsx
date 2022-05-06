import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import {app_colors} from "app_colors.js"
import { Loader } from "client/component/ui/Loader"
import { isDesktop } from "util/desktop"
import { compareSelections } from "util/selection"

type Props = {
    setWS: (ws: WaveSurfer) => void,
    chopLoading: boolean,
    onDragStart?: () => void
}

export const WaveForm: FunctionComponent<Props> = ({ setWS, chopLoading, onDragStart: _onDragStart }) => {
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
            progressColor: app_colors.acc['2'],
            responsive: true,
            waveColor: '#EFEFEF',
            cursorColor: 'transparent',
        })

        setWS(waveshaper)   
        
        waveshaper.on('ready', function () {
            waveshaper.play()
        })
    }, [])

    const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()

        if(!showChopLoading && !chopLoading) {
            console.log(_onDragStart)

            _onDragStart?.()
        }
    }

    return (<>
        <div id="waveform" 
        ref={divRender} 
        className={`w-[250px] h-[150px] bg-black py-1 px-5 bg-opacity-10 rounded-md flex flex-col align-center justify-center ${showChopLoading ? 'loading' : ''}`} draggable={true} onDragStart={onDragStart}>
                {showChopLoading ? <Loader /> : <></> }
        </div>
    </>)
}