import { TextInput, ScrollArea, Checkbox } from "@mantine/core"
import { FilterUpdate } from "client/util/localFilter"
import React, { FunctionComponent } from "react"
import { useEffect } from "react"
import { includeElement } from "util/arrays"
import { FilterSection } from "./FilterSection"

type Props = {
    fileNames: string[],
    files: string[],
    updateFiles: FilterUpdate<'file'>
}

export const FilterFile: FunctionComponent<Props> = ({ fileNames, files, updateFiles }) => {
    // useEffect(() => {
    //     console.log(files)
    // }, [ files ])

    return (<>
        <FilterSection header="File">
            <TextInput 
                placeholder='Filter...'
                size='xs'
            />

            <ScrollArea sx={{ maxHeight: '300px' }}>
                {fileNames.map(f => <Checkbox 
                    label={f}
                    key={f}

                    checked={files.includes(f)}

                    onChange={({target: { checked } }) => updateFiles({
                        in: includeElement(files, f, checked)
                    })}
                />)}
            </ScrollArea>
        </FilterSection>
    </>)
}