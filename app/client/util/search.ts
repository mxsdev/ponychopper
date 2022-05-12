import { useEffect, useState } from "react"
import type Fuse from 'fuse.js'

export const useFuseSearch = <T>(searchFrom: T[]) => {
    const [ query, setQuery ] = useState<string>('')

    const [ filtered, setFiltered ] = useState<({item: T } & Partial<Fuse.FuseResult<T>>)[]>(searchFrom.map(s => ({ item: s })))

    useEffect(() => {
        if(!query) {
            setFiltered(searchFrom.map(s => ({ item: s })))
            return
        }

        import('fuse.js').then(({ default: Fuse }) => {
            setFiltered(
                new Fuse(searchFrom, { includeMatches: true })
                    .search(query)
            )
        })
    }, [ query, searchFrom ])

    return { query, setQuery, filtered }
}