import { TextInput, ScrollArea, Checkbox, Space, Highlight } from "@mantine/core"
import { FilterUpdate } from "client/util/localFilter"
import { useFuseSearch } from "client/util/search"
import React, { FunctionComponent, useState } from "react"
import { useEffect } from "react"
import { includeElement } from "util/arrays"
import { FilterSection } from "./FilterSection"

type Props = {
    fileNames: string[],
    files: string[],
    updateFiles: FilterUpdate<'file'>,
    soloMode: boolean,
}

export const FilterFile: FunctionComponent<Props> = ({ fileNames, files, updateFiles, soloMode }) => {
    const update = (name: string, include: boolean) => updateFiles({
        in: includeElement(files, name, include, { full: fileNames, soloMode })
    })

    const { filtered, query, setQuery } = useFuseSearch(fileNames)

    const filteredFiles = filtered.map(f => ({
        name: f.item,
        matches: f.matches?.[0]?.indices.map(([i, j]) => f.item.slice(i, j+1))
    }))

    return (<>
        <FilterSection header="File">
            <TextInput 
                placeholder='Filter...'
                size='xs'

                value={query}
                onChange={({ target: { value } }) => setQuery(value)}
            />

            <Space h='xs' />

            <ScrollArea sx={{ maxHeight: '300px' }}>
                {filteredFiles.map(({name: f, matches}) => <Checkbox 
                    label={<Highlight size='sm' highlight={matches ?? []}>{f}</Highlight>}

                    size='xs'

                    key={f}

                    checked={files.includes(f)}

                    onChange={({target: { checked } }) => update(f, checked)}
                />)}
            </ScrollArea>
        </FilterSection>
    </>)
}