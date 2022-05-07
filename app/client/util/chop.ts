import { useChopFileSummary } from './fileSummary';
import { ChopFileSummary, FilterOpts } from "chops/chops"
import { AddEventListener, PCEventListener, RemoveEventListener } from "client/event/events"
import { useEffect, useState } from "react"

export const useChops = () => {
    const { loading, chopSummary, chopsEnabled } = useChopFileSummary()

    const [ filter, _setFilter ] = useState<FilterOpts>({ syllables: { lte: 3, gte: 1 } })

    const updateFilter = (opts: Partial<FilterOpts>) => {
        _setFilter({ ...filter, ...opts })
    }

    useEffect(() => {
        api.signalReady('main')
    }, [])

    useEffect(() => {
        if(loading) return
        api.filter(filter)
    }, [filter, loading])

    const chop = () => {
        if(!chopsEnabled) {
            alert('No files found to chop!\n\nYou can change the source file directory in the settings.')
            return
        }

        api.chop()
    }

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