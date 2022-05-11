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

    // const _updateFilter = useCallback((update: UpdateStateArgument<Partial<FilterOpts>>, localOnly: boolean = false) => {

    //     const new_filter = {
    //         ...filter,
    //         ...update
    //     }

    //     // optimistic update
    //     setFilter((_f) => ({
    //         ..._f,
    //         ...update
    //     }))

    //     console.log(new_filter)
            
    //     if(!localOnly) api.filter(new_filter)
    // }, [ filter ])

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

        const new_filter = {
            ...f,
            ...update
        }

        // optimistic update
        setFilter((_f) => ({
            ..._f,
            ...update
        }))
        
        if(!localOnly) api.filter(new_filter)
    }

    // useEffect(() => {
    //     console.log({
    //         from: 'useEffect',
    //         filter
    //     })
    // }, [ filter ])

    useEffect(() => {
        latestFilter.current = filter
    }, [ filter ])

    return {
        filter,
        updateFilter,
        chopsAvailable
    }
}