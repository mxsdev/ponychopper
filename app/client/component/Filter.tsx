import { Container } from "@mantine/core"
import { ChopFileSummary, FilterOpts } from "chops/chops"
import React, { FunctionComponent } from "react"
import { FilterFile } from "./filter/FilterFile"
import { FilterMeta } from "./filter/FilterMeta"
import { FilterPitch } from "./filter/FilterPitch"
import { FilterSearch } from "./filter/FilterSearch"
import { FilterSentence } from "./filter/FilterSentence"
import { FilterSpeaker } from "./filter/FilterSpeaker"
import { FilterSyllables } from "./filter/FilterSyllables"

type Props = {
    filter: FilterOpts,
    updateFilter: <T extends keyof FilterOpts>(key: T, data: Partial<NonNullable<FilterOpts[T]>>, local?: boolean) => void,
    chopSummary: ChopFileSummary|null,
    loading: boolean
}

export const Filter: FunctionComponent<Props> = ({ filter, updateFilter, chopSummary, loading }) => {
    if(loading || !chopSummary) return <></>

    return (<>
        <Container>
            {/* Search */}
            <FilterSearch 
                query={filter?.search?.query ?? ''}
                type={filter?.search?.type ?? 'fuzzy'}
                updateSearch={(d) => updateFilter('search', d)}
            />

            {/* Syllables */}
            <FilterSyllables 
                syllables={filter.syllables}
                updateSyllables={(d, local) => updateFilter('syllables', d, local)}
            />

            {/* Speaker */}
            <FilterSpeaker 
                speakers={filter.speaker?.in ?? []}
                speakerList={chopSummary.speakers}
                updateSpeakers={(d, local) => updateFilter('speaker', d, local)}
            />

            {/* Pitch */}
            <FilterPitch 
                classes={filter.pitch?.classes ?? []}
                nonstrict={!!filter.pitch?.nonstrict}
                octaves={filter.pitch?.octaves}
                updatePitch={(d, local) => updateFilter('pitch', d, local)}
            />

            {/* Sentence */}
            <FilterSentence 
                word={!!filter.sentence?.word}
                other={!!filter.sentence?.other}
                numWords={filter.sentence?.numWords}
                updateSentence={(d, local) => updateFilter('sentence', d, local)}
            />
            
            {/* Meta */}
            <FilterMeta
                season={filter.meta?.season ?? []}
                seasonList={chopSummary.meta.seasons}
                updateMeta={(d, local) => updateFilter('meta', d, local)}
            />

            {/* File */}
            <FilterFile 
                fileNames={chopSummary.fileNames}
                files={filter.file ?? []}
                updateFiles={(d, local) => updateFilter('file', d, local)}
            />
        </Container>
    </>)
}