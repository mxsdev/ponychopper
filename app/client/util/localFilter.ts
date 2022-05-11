import { FilterResult } from "chops/chopManager"
import { FilterOpts } from "chops/chops"
import { AddEventListener, PCEventListener, RemoveEventListener } from "client/event/events"
import { useCallback, useEffect, useRef, useState } from "react"
import { UpdateState, UpdateStateArgument } from "util/types/state"
import { useEvent } from "./event"

export type FilterUpdate<T extends keyof FilterOpts> = UpdateState<FilterOpts[T]>

export const useFilter = () => {
    const [ filter, setFilter ] = useState<FilterOpts>({ })

    const latestFilter = useRef(filter)

    const [ filterResult, setFilterResult ] = useState<FilterResult>({ amount: 0 })

    const chopsAvailable = filterResult?.amount > 0

    useEvent('set_filter', ({ detail: { filter: update } }) => {
        setFilter(update)
    })

    useEvent('filter_result', ({ detail: { result } }) => {
        setFilterResult(result)
    })

    const updateFilter = <T extends keyof FilterOpts>(p: T, v: Partial<NonNullable<FilterOpts[T]>>, localOnly?: boolean) => {
        const f = latestFilter.current

        const update = {
            [p]: {
                ...f[p],
                ...v
            }
        }

        // optimistic update
        setFilter((_f) => ({
            ..._f,
            ...update
        }))

        if(!localOnly) api.filter({
            ...f,
            ...update
        })
    }

    useEffect(() => {
        latestFilter.current = filter
    }, [ filter ])

    return {
        filter,
        updateFilter,
        chopsAvailable
    }
}

export type FilterUpdateFn = ReturnType<typeof useFilter>['updateFilter']