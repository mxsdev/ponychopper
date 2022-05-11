import { Radio, RadioGroup, TextInput } from "@mantine/core"
import { FilterOpts } from "chops/chops"
import { FilterUpdate } from "client/util/localFilter"
import React, { FunctionComponent } from "react"
import { UpdateState } from "util/types/state"
import { ClearButton } from "../input/ClearButton"
import { FilterSection } from "./FilterSection"

type SearchType = NonNullable<NonNullable<FilterOpts['search']>['type']>

type Props = {
    updateSearch: FilterUpdate<'search'>,
    query: string,
    type: SearchType
}

const TypeMeta: { [index in SearchType ]: { label: string }} = {
    exact: { label: 'Exact' },
    fuzzy: { label: 'Fuzzy' },
    regex: { label: 'RegEx' }
}

export const FilterSearch: FunctionComponent<Props> = ({ updateSearch, query, type }) => {

    const updateQuery = (q: string) => updateSearch({ query: q })
    const updateType = (type: SearchType) => updateSearch({ type })

    return (<>
        <FilterSection header="Search">
            
            <TextInput 
                size='xs'
                placeholder='Search query...'

                rightSection={query ? 
                    <ClearButton onClick={()  => updateQuery('')} /> 
                : undefined }

                value={query}
                onChange={({ target: { value } }) => updateQuery(value)}
            />

            <RadioGroup size='sm'
                value={type}
                onChange={(v) => updateType(v as SearchType)}
            >
                {(Object.keys(TypeMeta) as SearchType[]).map(k => (
                    <Radio value={k} key={k} label={TypeMeta[k].label} />
                ))}
            </RadioGroup>
        </FilterSection>
    </>)
}