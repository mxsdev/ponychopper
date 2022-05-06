import { Paid } from "@mui/icons-material"
import { ChopFileSummary, FilterOpts } from "chops/chops"
import { useEffect, useState } from "react"

export const useChops = () => {
    const [ loading, setLoading ] = useState<boolean>(true)
    const [ sourceFileDir, setSourceFileDir ] = useState<string|null>(null)

    const [ chopSummary, setChopSummary ] = useState<ChopFileSummary|null>(null)

    const chopsEnabled = chopSummary && chopSummary.numFiles > 0

    const [ filter, _setFilter ] = useState<FilterOpts>({ syllables: { lte: 3, gte: 1 } })

    const updateFilter = (opts: Partial<FilterOpts>) => {
        _setFilter({ ...filter, ...opts })
    }

    const loadChops = async (dir: string) => {
        setLoading(true)

        const summary = await api.loadChops(dir)

        if(!loading) return

        setChopSummary(summary)
        if(summary) setLoading(false)

        return summary
    }
    
    useEffect(() => {
        // api.defaultChopDirectory()
        //     .then(v => console.log(`Default chop directory: ${v}`))

        loadChops('/Users/maxstoumen/Projects/ponychopper-audio')
    }, [])

    useEffect(() => {
        if(loading) return
        api.filter(filter)
    }, [filter, loading])

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