import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import {app_colors} from "app_colors.js"
import { Loader } from "client/component/ui/Loader"
import { isDesktop } from "util/desktop"
import { ChopSelectionListener } from "chops/chopManager"
import { compareSelections } from "util/selection"

type Props = {
    setWS: (ws: WaveSurfer) => void,
    chopLoading: boolean,
}

export const WaveForm: FunctionComponent<Props> = ({ setWS, chopLoading }) => {
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

        // const selListener: ChopSelectionListener = (val) => {
        //     setChopLoading(true)

        //     // TODO: we need to abort this upon reaching another selection
        //     api.loadBuffer()
        //         .then((buff) => {
        //             const curr = api.currentChop()

        //             if(!curr || !(compareSelections(val, curr))) return
                    
        //             waveshaper.loadBlob(new Blob([buff]))
        //         })
        //         .catch((e) => {
        //             console.log(e)
        //         })
        //         .finally(() => {
        //             setChopLoading(false)
        //         })
        // }

        // // console.log(api.addChopSelectionListener(selListener))

        // api.addChopSelectionListener(selListener)

        // return () => {
        //     api.removeChopSelectionListener(selListener)
        // }

        // api.reloadChops('/Users/maxstoumen/Projects/ponychopper-audio')
        //     .then((numFound) => {
        //         console.log(`Found ${numFound} chop files!`)
        //     })
        //     .then(() => {
        //         const sel = api.chop()

        //         console.log(sel)

        //         return api.loadBuffer()
        //     })
        //     .then((buff) => {
        //         console.log(`Buffer length: ${buff.length}`)

        //         waveshaper.loadBlob(new Blob([buff]))
        //     })

        // @ts-ignore
        // window.electron.getChopDataBlob({episode: '0', chop_filename: 'pp_alittle.wav'}).then(data => {
        //     waveshaper.loadBlob(data)
        // })

        // waveshaper.load('https://file-examples-com.github.io/uploads/2017/11/file_example_WAV_1MG.wav')
    }, [])

    const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()

        if(isDesktop() && !showChopLoading && !chopLoading) {
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
}