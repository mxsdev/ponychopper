import { Chip, Chips } from "@mantine/core"
import { FilterUpdate } from "client/util/localFilter"
import React, { FunctionComponent } from "react"
import { usePossiblyUndefinedList } from "util/list"
import { FilterSection } from "./FilterSection"

type Props = {
    speakers: (string|undefined)[],
    updateSpeakers: FilterUpdate<'speaker'>,
    speakerList: (string|undefined)[]
}

export const FilterSpeaker: FunctionComponent<Props> = ({ speakers, updateSpeakers, speakerList }) => {
    const [ convert, convertBack ] = usePossiblyUndefinedList<string>('__unknown')

    const speakerValues = speakers.map(s => convert(s))

    const updateSpeakerValues = (v: string[]) => {
        updateSpeakers({
            in: v.map(s => convertBack(s))
        })
    }

    return (<>
        <FilterSection header="Speaker">
            <Chips size="xs" value={speakerValues}
            multiple={true}

            onChange={updateSpeakerValues}
            >
                {speakerList.map((s) => (
                    <Chip value={convert(s)} key={convert(s)}>{s ?? 'Unknown'}</Chip>
                ))}
            </Chips>
        </FilterSection>
    </>)
}