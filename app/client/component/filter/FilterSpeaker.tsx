import { Chip, Chips } from "@mantine/core"
import { FilterUpdate } from "client/util/localFilter"
import React, { FunctionComponent } from "react"
import { includeElement } from "util/arrays"
import { usePossiblyUndefinedList } from "util/list"
import { FilterSection } from "./FilterSection"

type Props = {
    speakers: (string|undefined)[],
    updateSpeakers: FilterUpdate<'speaker'>,
    speakerList: (string|undefined)[],
    soloMode: boolean
}

export const FilterSpeaker: FunctionComponent<Props> = ({ speakers, updateSpeakers, speakerList, soloMode }) => {
    const [ convert, convertBack ] = usePossiblyUndefinedList<string>('__unknown')

    const speakerValues = speakers.map(s => convert(s))

    const update = (s: string|undefined) => updateSpeakers({
        in: includeElement(speakers, s, !speakers.includes(s), {
            full: speakerList,
            soloMode
        })
    })

    return (<>
        <FilterSection header="Speaker">
            <Chips size="xs" value={speakerValues}
            multiple={true}
            >
                {speakerList.map((s) => (
                    <Chip 
                        onClick={() => update(s)}
                    value={convert(s)} key={convert(s)}>{s ?? 'Unknown'}</Chip>
                ))}
            </Chips>
        </FilterSection>
    </>)
}