import { SimpleGrid, Checkbox } from "@mantine/core"
import { FilterUpdate } from "client/util/localFilter"
import React, { FunctionComponent } from "react"
import { NumericComparison } from "util/types/numeric"
import { HybridSlider } from "../input/HybridSlider"
import { FilterSection } from "./FilterSection"
import { FilterSubheader } from "./FilterSubheader"

type Props = {
    word: boolean,
    other: boolean,
    numWords: NumericComparison|undefined,
    updateSentence: FilterUpdate<'sentence'>
}

export const FilterSentence: FunctionComponent<Props> = ({ word, other, numWords, updateSentence }) => {
    return (<>
        <FilterSection header="Sentence">
        <SimpleGrid cols={5}>
            <Checkbox size='xs' label='Words' 
                checked={word} 
                onChange={({ target: { checked } }) => updateSentence({ word: checked })}
            />
            <Checkbox size='xs' label='Non-Words' 
                checked={other} 
                onChange={({ target: { checked } }) => updateSentence({ other: checked })}
            />
        </SimpleGrid>

        <FilterSubheader text="Number of Words" />
        
        <HybridSlider 
            max={16}
            marks={[0, 4, 8, 12, 16].map(i => ({ value: i, label: String(i) }))}

            value={numWords}

            setValue={(v, local) => updateSentence({ numWords: v }, local)}
        />
        </FilterSection>
    </>)
}