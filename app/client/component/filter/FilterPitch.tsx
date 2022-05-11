import { Box, Checkbox, Grid, NativeSelect, Space, Switch } from "@mantine/core"
import { FilterUpdate } from "client/util/localFilter"
import { useModifierKeys } from "client/util/modifierKeys"
import React, { FunctionComponent } from "react"
import { includeElement } from "util/arrays"
import { genKey, PitchKeys } from "util/pitch"
import { NumericComparison } from "util/types/numeric"
import { HybridSlider } from "../input/HybridSlider"
import { FilterSection } from "./FilterSection"
import { FilterSubheader } from "./FilterSubheader"

type Props = {
    classes: (number|undefined)[],
    octaves: NumericComparison|undefined,
    updatePitch: FilterUpdate<'pitch'>,
    nonstrict: boolean
}

const PitchKeyValues = PitchKeys.map((_, i) => i+1)

export const FilterPitch: FunctionComponent<Props> = ({ classes, octaves, updatePitch, nonstrict }) => {
    const { modMain, modAlt } = useModifierKeys()

    const updateClasses = (checked: boolean, key: number|undefined) => {
        const otherChecked = classes.filter(x => x != null && x !== key).length > 0

        if(modMain) {
            if(otherChecked) {
                updatePitch({ classes: [ key ] })
            } else {
                updatePitch({ classes: [...PitchKeyValues, undefined] })
            }

            return
        }

        updatePitch({
            classes: includeElement(classes, key, checked)
        })
    }

    return (<>
        <FilterSection header="Pitch">
            <Grid>
                {PitchKeys.map((keyName, i) => {
                    const key = i+1

                    return (
                    <Grid.Col span={2} key={keyName}>
                        <Checkbox 
                            label={keyName} 
                            size='xs' 

                            checked={classes.includes(key)}
                            onChange={({ target: { checked } }) => updateClasses(checked, key)}
                        />
                    </Grid.Col>
                )})}
            </Grid>

            <Space h='xs' />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={(theme) => ({display: 'flex', gap: theme.spacing.xl})}>
                    <Checkbox 
                        size='xs'
                        label='None'
                        
                        checked={classes.includes(undefined)}
                        onChange={({ target: { checked } }) => updateClasses(checked, undefined)}
                    />

                    <Switch
                        size='xs'
                        checked={!nonstrict}

                        onChange={({target: { checked }}) => updatePitch({ nonstrict: !checked })}

                        label='Strict'
                    />
                </Box>

                {/* TODO: style this glassy */}
                <NativeSelect
                    variant='filled'
                    size='xs'
                    
                    data={PitchKeys.flatMap(((key, i) => [
                        { value: `${i+1},maj`, label: `${key} major` },
                        { value: `${i+1},min`, label: `${key} minor` }
                    ]))}
                    
                    sx={{
                        width: '30%',
                        float: 'right'
                    }}

                    placeholder="Set key..."

                    value={''}

                    onChange={(v) => {
                        if(!v) return
                        const [ key, mode ] = v.target.value.split(',')
                        
                        updatePitch({ classes: genKey(Number(key), mode) })
                    }}
                />
            </Box>

            <Space h='xs' />

            <FilterSubheader text="Octave" />

            <HybridSlider 
                value={octaves}
                setValue={(octaves, local) => updatePitch({ octaves }, local)}

                max={12}
                marks={[0, 4, 8, 12].map(i => ({ value: i, label: String(i) }))}
            />
        </FilterSection>
    </>)
}