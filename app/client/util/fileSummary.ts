import { ChopFileSummary } from "chops/chops"
import { PCEventListener, AddEventListener, RemoveEventListener } from "client/event/events"
import { useState, useEffect } from "react"

export const useChopFileSummary = () => {
    const [ chopSummary, setChopSummary ] = useState<ChopFileSummary|null>(null)

    const [ loading, setLoading ] = useState<boolean>(true)

    const chopsEnabled = chopSummary && chopSummary.numChopFragments > 0

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

    const reloadFiles = () => api.reloadFiles()
        .then((summ) => {
            alert(`Found ${summ.numFiles} file(s).`)
        })
        .catch((e) => {
            console.log(e)
            alert(`Error loading files.`)
        })

    return { chopSummary, loading, chopsEnabled, reloadFiles }
}