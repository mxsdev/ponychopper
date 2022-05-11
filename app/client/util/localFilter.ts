import { FilterResult } from "chops/chopManager"
import { FilterOpts } from "chops/chops"
import { AddEventListener, PCEventListener, RemoveEventListener } from "client/event/events"
import { useEffect, useState } from "react"
import { UpdateState, UpdateStateArgument } from "util/types/state"
import { useEvent } from "./event"

export type FilterUpdate<T extends keyof FilterOpts> = UpdateState<FilterOpts[T]>

export const useFilter = () => {
    const [ filter, setFilter ] = useState<FilterOpts>({ })

    const [ filterResult, setFilterResult ] = useState<FilterResult>({ amount: 0 })

    const chopsAvailable = filterResult?.amount > 0

    const _updateFilter = (update: UpdateStateArgument<Partial<FilterOpts>>, localOnly: boolean = false) => {
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

    const updateFilter = <T extends keyof FilterOpts>(p: T, v: Partial<NonNullable<FilterOpts[T]>>, localOnly?: boolean) => {

        _updateFilter({
            [p]: {
                ...filter[p],
                ...v
            }
        })

    }

    // const updateQuery: UpdateState<FilterOpts['search']> = ()

    return {
        filter,
        updateFilter,
        chopsAvailable
    }
}