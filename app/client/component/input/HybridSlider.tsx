import { Box, Switch, RangeSlider, Slider, Space } from "@mantine/core";
import React, { FunctionComponent } from "react"
import { NumericComparison } from "util/types/numeric";

type Props = {
    value?: NumericComparison,
     setValue?: (val: NumericComparison, local?: boolean) => void,
    min?: number, 
    max: number, 
    step?: number, 
    minRange?: number, 
    marks: {
        value: number;
        label?: React.ReactNode;
    }[]
}

export const HybridSlider: FunctionComponent<Props> = ({ value, setValue, min=0, max, step=1, minRange=1, marks }) => {
    const disabled = !value

    const isRange = (value?.eq == null)

    const setMode = (range: boolean) => {
        if(isRange === range) return

        if(range === true && value?.eq != null) {
            setValue?.({ gte: value.eq, lte: max })
        } else if(value?.gte != null) {
            setValue?.({ eq: value.gte })
        }
    }

    return (<>
        <Box
            sx={{
                display: 'flex'
            }}
        >
            <Switch
                disabled={disabled}

                checked={isRange}
                onChange={({ target: { checked } }) => {
                    setMode(checked)
                }}

                sx={(theme) => ({
                    marginRight: theme.spacing.md
                })}

                styles={{
                    input: {
                        ':hover': {
                            cursor: 'pointer'
                        }
                    }
                }}
            />
            
            <Box
                sx={{
                    width: '100%'
                }}
            >
                { isRange ? 
                    <RangeSlider
                        onChange={(v) => setValue?.({ gte: v[0], lte: v[1] }, true)}
                        onChangeEnd={(v) => setValue?.({ gte: v[0], lte: v[1] })}
                        value={[value?.gte ?? min, value?.lte ?? max]}

                        min={min} max={max} step={step}

                        marks={marks}

                        minRange={minRange}

                        disabled={disabled}
                    />
                :  
                    <Slider 
                        onChange={(v) => setValue?.({ eq: v }, true) }
                        onChangeEnd={(v) => setValue?.({ eq: v }) }
                        value={value.eq ?? 0}

                        min={min} max={max} step={step}

                        marks={marks}

                        disabled={disabled}
                    />
                }
            </Box>
        </Box>
        
        <Space h='xs' />
        
        </>)
}