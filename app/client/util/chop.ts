import { ChopFileSummary, FilterOpts } from "chops/chops"
import { AddEventListener, PCEventListener, RemoveEventListener } from "client/event/events"
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
        const fileStatusListener: PCEventListener<'chop_file_status'> = ({ detail: { status } }) => {
            setLoading(status.loading)

            if(status.summary) {
                setChopSummary(status.summary)
            }
        }

        AddEventListener('chop_file_status', fileStatusListener)

        return () => {
            RemoveEventListener('chop_file_status', fileStatusListener)
        }
    }, [])

    useEffect(() => {
        api.signalReady('main')
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