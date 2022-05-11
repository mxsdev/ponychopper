import { Chip, Chips, Space } from "@mantine/core"
import { FilterUpdate } from "client/util/localFilter"
import React, { FunctionComponent } from "react"
import { usePossiblyUndefinedList } from "util/list"
import { FilterSection } from "./FilterSection"
import { FilterSubheader } from "./FilterSubheader"

type Props = {
    season: (number|undefined)[],
    updateMeta: FilterUpdate<'meta'>,
    seasonList: (number|undefined)[]
}

export const FilterMeta: FunctionComponent<Props> = ({ season, updateMeta, seasonList }) => {
    const [ _convert, convertBack ] = usePossiblyUndefinedList<string>('__unknown')

    const convert = (n: number|undefined) => {
        return _convert((n !== undefined) ? String(n) : n)
    }

    const speakerValues = season.map(s => convert(s))

    const updateSpeakerValues = (v: string[]) => {
        updateMeta({
            season: v.map(s => {
                const res = convertBack(s)
                if(res === undefined) return res
                return Number(res)
            })
        })
    }

    return (<>
        <FilterSection header="Meta">
            <FilterSubheader text="Season" align='left' />

            <Chips size='xs'
                multiple
                value={speakerValues}

                onChange={updateSpeakerValues}
                
                sx={(theme) => ({
                    // TODO: add another spacing variable of size xs/2
                    marginTop: `calc(${theme.spacing.xs}px / 2)`
                })}
            >
                {seasonList.map(s => (
                    <Chip value={convert(s)}>
                        {s ? String(s) : 'Unknown'}
                    </Chip>
                ))}
            </Chips>
        </FilterSection>
    </>)
}