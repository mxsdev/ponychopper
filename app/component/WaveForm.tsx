import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import {app_colors} from "app_colors.js"
import Loader from "component/Loader"
import { ChopID } from "main"
import { isDesktop } from "util/desktop"

interface OwnProps {
    ws: WaveSurfer|null,
    setWS: (ws: WaveSurfer) => void,
    chopLoading: boolean,
    setChopLoading: (loading: boolean) => void,
    currChopID: ChopID|null
}

type Props = OwnProps

export default (({ws, setWS, chopLoading, setChopLoading, currChopID}) => {
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
        // file:///I:/MLP/Snippets/pp/pp_but.wav

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
            setChopLoading(false)
            waveshaper.play()
        })

        // @ts-ignore
        // window.electron.getChopDataBlob({episode: '0', chop_filename: 'pp_alittle.wav'}).then(data => {
        //     waveshaper.loadBlob(data)
        // })

        // waveshaper.load('https://file-examples-com.github.io/uploads/2017/11/file_example_WAV_1MG.wav')
    }, [])

    const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()

        if(isDesktop() && !showChopLoading && currChopID) {
            // @ts-ignore
            // window.electron.startDrag(currChopID)
            // TODO: start drag
        }
    }

    return (<>
        <div id="waveform" 
        ref={divRender} 
        className={`w-[250px] h-[150px] bg-black py-1 px-5 bg-opacity-10 rounded-md flex flex-col align-center justify-center ${showChopLoading ? 'loading' : ''}`} draggable={true} onDragStart={onDragStart}>
                {showChopLoading ? <Loader /> : <></> }
        </div>
    </>)
}) as FunctionComponent<Props>