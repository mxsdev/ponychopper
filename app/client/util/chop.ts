import { Paid } from "@mui/icons-material"
import { ChopFileStatus } from "chops/chopManager"
import { ChopFileSummary, FilterOpts } from "chops/chops"
import { ELECTRON_CONFIG } from "electron/config"
import { useEffect, useState } from "react"

export const useChops = () => {
    const [ loading, setLoading ] = useState<boolean>(true)

    const [ chopSummary, setChopSummary ] = useState<ChopFileSummary|null>(null)

    const chopsEnabled = chopSummary && chopSummary.numFiles > 0

    const [ filter, _setFilter ] = useState<FilterOpts>({ syllables: { lte: 3, gte: 1 } })

    const updateFilter = (opts: Partial<FilterOpts>) => {
        _setFilter({ ...filter, ...opts })
    }

    useEffect(() => {
        const EVT_FILESTATUS = ELECTRON_CONFIG.window_events.chop.filesStatus

        const fileStatusListener = (({ detail: { status } }: CustomEvent<{ status: ChopFileStatus }>) => {
            setLoading(status.loading)

            if(status.summary) {
                console.log(status.summary)
                setChopSummary(status.summary)
            }
        }) as EventListener

        window.addEventListener(
            EVT_FILESTATUS, 
            fileStatusListener
        )

        return () => {
            window.removeEventListener(
                EVT_FILESTATUS,
                fileStatusListener
            )
        }
    }, [])

    useEffect(() => {
        api.signalReady()
    }, [])

    useEffect(() => {
        if(loading) return
        api.filter(filter)
    }, [filter, loading])

    // useEffect(() => {
    //     const bufferListener = (ev: CustomEvent<{ buff: Buffer }>) => {
            
    //     }

    //     window.addEventListener(ELECTRON_CONFIG.window_events.chop.buffer, )
    // }, [])

    useEffect(() => {

    })

    const chop = () => api.chop()
    const prev = () => api.prevChop()
    const next = () => api.nextChop()

    return {
        loading,
        chopsEnabled,
        
        updateFilter, filter,

        chop,
        prev,
        next
    }
}