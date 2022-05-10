import { useChopFileSummary } from './fileSummary';
import { ChopFileSummary, FilterOpts } from "chops/chops"
import { AddEventListener, PCEventListener, RemoveEventListener } from "client/event/events"
import { useEffect, useState } from "react"

export const useChops = () => {
    const { loading, chopSummary, chopsEnabled } = useChopFileSummary()

    useEffect(() => {
        api.signalReady('main')
    }, [])

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
        chopSummary,
        
        chop,
        prev,
        next
    }
}