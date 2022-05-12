import { Chip, Chips, Space } from "@mantine/core"
import { FilterUpdate } from "client/util/localFilter"
import React, { FunctionComponent } from "react"
import { includeElement } from "util/arrays"
import { usePossiblyUndefinedList } from "util/list"
import { FilterSection } from "./FilterSection"
import { FilterSubheader } from "./FilterSubheader"

type Props = {
    season: (number|undefined)[],
    updateMeta: FilterUpdate<'meta'>,
    seasonList: (number|undefined)[],
    soloMode: boolean
}

export const FilterMeta: FunctionComponent<Props> = ({ season, updateMeta, seasonList, soloMode }) => {
    const [ _convert, convertBack ] = usePossiblyUndefinedList<string>('__unknown')

    const convert = (n: number|undefined) => {
        return _convert((n !== undefined) ? String(n) : n)
    }

    const speakerValues = season.map(s => convert(s))

    const updateSeason = (s: number|undefined) => updateMeta({
        season: includeElement(season, s, !season.includes(s), {
            full: seasonList,
            soloMode: soloMode
        })
    })

    return (<>
        <FilterSection header="Meta">
            <FilterSubheader text="Season" align='left' />

            <Chips size='xs'
                multiple
                value={speakerValues}

                sx={(theme) => ({
                    // TODO: add another spacing variable of size xs/2
                    marginTop: `calc(${theme.spacing.xs}px / 2)`
                })}
            >
                {seasonList.map(s => (
                    <Chip value={convert(s)} onClick={() => updateSeason(s)}>
                        {s ? String(s) : 'Unknown'}
                    </Chip>
                ))}
            </Chips>
        </FilterSection>
    </>)
}