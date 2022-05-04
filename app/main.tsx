import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from "react"
import WaveSurfer from 'wavesurfer.js'
import Button from 'component/Button'
import WaveForm from 'component/WaveForm'
import Filter from 'component/Filter'
import DesktopMenuItems from 'component/DesktopMenuItems'
import { registerGlobalHotkeys, registerHotkeys, unregisterGlobalHotkeys, unregisterHotkeys } from "hotkeys"
import { Character, Song, Season, listCharacters, listSongs, listSeasons, songLocale } from "locale"
import { useLocalStorage } from "helpers"
import controls from "controls"
import { isDesktop } from "util/desktop"

interface OwnProps {
    
}

type Props = OwnProps

type ChopsData = {
    version: number,
    data: {
        [index in Song]: string[]
    }
}

export type ChopID = {song: Song, chop_filename: string}

export type ChopTransformed = ChopID & {
    character: Character,
    season: Season,
    slug: string,
    //TODO: add phrase type (word, subword, phrase)
}

export type FilterOpts = {
    songs: Song[],
    seasons: Season[],
    characters: Character[],
}

export default ((props) => {
    // wavesurfer instance    
    const [ws, setWS] = useState<WaveSurfer|null>(null)

    // chops data
    const [chopsData, setChopsData] = useLocalStorage<ChopsData|null>('chopsData', null)
    const [chopsDataLoading, setChopsDataLoading] = useState<boolean>(!!chopsData)

    useEffect(() => {
        if(isDesktop()) {
            // @ts-ignore
            // window.electron.getChopsData()
            //     .then((data: ChopsData) => setChopsData(data))
            //     .finally(() => setChopsDataLoading(false))
            // TODO: initialize chops data

        }

        // console.log('got here 1')
        // console.log(api.test())

        api.defaultChopDirectory()
            .then(v => console.log(v))

        // console.log(api.wtf())
    }, [])

    // load chop
    const [currChopID, setCurrChopID] = useState<ChopID|null>(null)
    const [chopLoading, setChopLoading] = useState<boolean>(false)

    const loadChop = (chop_id: ChopID) => {
        if(!ws) return
        
        setChopLoading(true)

        if(isDesktop()) {
            // @ts-ignore
            // window.electron.getChopDataBlob(chop_id)
            //     .then((blob: Blob) => {
            //         ws.loadBlob(blob)
            //         setCurrChopID(chop_id)
            //     })
            // TODO: load chop
                // .finally(() => setChopLoading(false))
        } else {
            // TODO: web loading
            // ws.load()
            // setChopLoading(false)
        }
    }

    // chops
    function transformChop(chop_id: ChopID) {
        const song = chop_id.song
        const chop_filename = chop_id.chop_filename

        const name = chop_filename.split('.')[0]

        const args = name.split('_')

        const transformed: ChopTransformed = {
            song: song, chop_filename,
            character: args[0] as Character,
            slug: args[1] ?? '',
            season: songLocale[song]?.season as Season
        }

        return transformed
    }

    function transformChops({data: chops}: ChopsData) {
        const chop_ids_unflattened = Object.keys(chops).map(key => chops[key as unknown as Song]
            .map((chop): ChopID => ({ song: key as unknown as Song, chop_filename: chop })))
        
        const chop_ids = chop_ids_unflattened.flat(1)

        return chop_ids.map(cid => transformChop(cid))
    }

    const [filterOpts, setFilterOpts] = useLocalStorage<FilterOpts>('filterOpts', {
        // characters: listCharacters().map(c => c.key),
        characters: [ 'fs', 'aj', 'm6', 'pp', 'ra', 'rd', 'ts' ],
        // characters: [ 'ra' ],`
	    seasons: listSeasons(),
        songs: listSongs().map(ep => ep.key)
    })

    const updateFilterOpts = (update: Partial<FilterOpts>) => setFilterOpts({...filterOpts, ...update})

    function getFilteredTransformedChops(data: ChopsData) {
        return transformChops(data)
             .filter(chop => filterOpts.characters.includes(chop.character))
            .filter(chop => filterOpts.songs.includes(chop.song))
            .filter(chop => filterOpts.seasons.includes(chop.season))
    }

    // useEffect(() => {
    //     if(chopsData) {
    //         updateFilterOpts({characters: ['ra']})
    //         console.log(getFilteredTransformedChops(chopsData))
    //     }
    // }, [chopsData])

    const chop = () => {
        if(!chopsData) return

        const chops = getFilteredTransformedChops(chopsData)

        if(chops.length === 0) {
            return
        }

        loadChop(
            chops[Math.floor(Math.random()*chops.length)]
        )
    }

    // register hotkeys
    useEffect(() => {
        registerHotkeys({ws, chop})
        return unregisterHotkeys
    }, [ws, chopsData, filterOpts])

    // register global hotkeys
    const [ globalMode, setGlobalMode ] = useLocalStorage<boolean>('globalMode', isDesktop() ? true : false)

    // useEffect(() => {
    //     if(isDesktop()) {
    //         if(globalMode) {
    //             registerGlobalHotkeys({ws, chop})
    //         } else {
    //             unregisterGlobalHotkeys()
    //         }
        
    //         return unregisterGlobalHotkeys
    //     }
    // }, [ws, chopsData, globalMode])

    // pin
    const [ pinned, setPinned ] = useLocalStorage<boolean>('pinned', false)

    useEffect(() => {
        api.setPinned(pinned)
    }, [pinned])

    return (<>
        <DesktopMenuItems globalMode={globalMode} setGlobalMode={setGlobalMode} pinned={pinned} setPinned={setPinned} />

        <div className="w-full max-w-[500px] mx-auto p-4 md:mt-32 mt-16">
            <p className="text-center text-5xl select-none">🔪.🐴</p>
            <p className="mt-8 text-center body-text">Because all 🐴🎵 is better with some 🔪</p>        

            <div className="flex items-center self-center justify-center mt-8">
                <div className="text-center overflow-hidden flex-col" draggable={true}>
                    <WaveForm currChopID={currChopID} ws={ws} setWS={setWS} chopLoading={chopLoading} setChopLoading={setChopLoading} />
                </div>

                <div className="flex-col ml-12">
                    <Button onClick={() => chop()}>
                        <span className="text-4xl select-none">🔪</span>
                    </Button>
                </div>
            </div>

            <p className="mt-8 text-center body-text">{controls(false)}</p>
            
            {globalMode ? <p className="mt-4 text-center body-text text-sm">🌎: {controls(true)}</p> : ''}

            {!isDesktop() ? <p className="mt-8 text-center body-text text-sm">Note: The <a href="http://github.com">desktop version</a> allows you to drag the audio file directly into your DAW + other nice features</p> : ''}

            <Filter filterOpts={filterOpts} updateFilterOpts={updateFilterOpts} />

            {/* <div className="text-center font-mono mt-8" draggable={true} onDragStart={onDragStart}>{config.desktop ? 'true' : 'false'}</div> */}
        </div>
    </>)
}) as FunctionComponent<Props>
