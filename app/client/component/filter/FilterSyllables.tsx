import { FilterUpdate } from "client/util/localFilter"
import React, { FunctionComponent } from "react"
import { NumericComparison } from "util/types/numeric"
import { HybridSlider } from "../input/HybridSlider"
import { FilterSection } from "./FilterSection"

type Props = {
    syllables: NumericComparison|undefined,
    updateSyllables: FilterUpdate<'syllables'>
}

export const FilterSyllables: FunctionComponent<Props> = ({ syllables, updateSyllables }) => {
    return (<>
        <FilterSection header="Syllables">
            <HybridSlider 
                value={syllables}
                setValue={(v, local) => updateSyllables({ numSyllables: v }, local)}
        
                max={16}
                marks={[0, 4, 8, 12, 16].map(v => ({ value: v, label: String(v) }))}
            />
        </FilterSection>
    </>)
}