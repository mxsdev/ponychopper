import { FilterResult } from "chops/chopManager"
import { FilterOpts } from "chops/chops"
import { AddEventListener, PCEventListener, RemoveEventListener } from "client/event/events"
import { useEffect, useState } from "react"
import { useEvent } from "./event"

export const useFilter = () => {
    const [ filter, setFilter ] = useState<FilterOpts>({ })

    const [ filterResult, setFilterResult ] = useState<FilterResult>({ amount: 0 })

    const chopsAvailable = filterResult?.amount > 0

    const updateFilter = (update: Partial<FilterOpts>, localOnly: boolean = false) => {
        const new_filter = {
            ...filter,
            ...update
        }

        // optimistic update
        setFilter(new_filter)
            
        if(!localOnly) api.filter(new_filter)
    }

    useEvent('set_filter', ({ detail: { filter: update } }) => {
        setFilter(update)
    })

    useEvent('filter_result', ({ detail: { result } }) => {
        setFilterResult(result)
    })

    return {
        filter,
        updateFilter,
        chopsAvailable
    }
}