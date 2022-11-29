import { useChopFileSummary } from './fileSummary';
import { ChopFileSummary, ChopSelection, FilterOpts } from "chops/chops"
import { AddEventListener, PCEventListener, RemoveEventListener } from "client/event/events"
import { useEffect, useState } from "react"
import { useEvent } from './event';

export const useChops = () => {
    const { loading, chopSummary, chopsEnabled } = useChopFileSummary()

    const [ selection, setSelection ] = useState<ChopSelection|null>(null)

    useEffect(() => {
        api.signalReady('main')
    }, [])
    
    useEvent("chop_selection", ({ detail: {selection: s} }) => setSelection(s))

    const chop = () => {
        if(!chopsEnabled) {
            alert('No files found to chop!\n\nYou can change the source file directory in the settings.')
            return
        }

        api.chop()
    }

    const prev = () => api.prevChop()
    const next = () => api.nextChop()
    const expandSelection = (direction: 'right'|'left') => api.expandSelection(direction)

    return {
        loading,
        chopsEnabled,
        chopSummary,
        
        chop,
        prev,
        next,
        expandSelection,

        selection
    }
}