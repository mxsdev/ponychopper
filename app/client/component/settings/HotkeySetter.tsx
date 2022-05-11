import { Grid, Select } from "@mantine/core"
import React, { FunctionComponent, useState } from "react"
import { Hotkey, HotkeyId, HotkeyIDs, HotkeyList, hotkeys } from "util/hotkeys"
import { HotkeyInputWrapper } from "../input/HotkeyInputWrapper"

type Props = {
    disabled?: boolean,
    hotkey?: HotkeyList,
    setHotkey?: (id: HotkeyId, hotkey: Hotkey|undefined) => void
}

export const HotkeySetter: FunctionComponent<Props> = ({disabled, hotkey, setHotkey}) => {
    const data = HotkeyIDs.reduce(
        (prev, curr) => [...prev, { value: curr, label: hotkeys[curr].label }], 
        [] as ({ value: HotkeyId, label: string })[]
    )

    const [ value, setValue ] = useState<HotkeyId>('play_pause')
    
    return (
        <Grid grow gutter='sm'>
            <Grid.Col span={4}>
                <Select 
                    data={data}
                    searchable
                    defaultValue='play'
                    size='xs'
                    label='Action'

                    maxDropdownHeight={150}

                    disabled={disabled}

                    value={value}
                    onChange={(val) => {
                        if(val) setValue(val as HotkeyId)
                    }}
                />
            </Grid.Col>
            <Grid.Col span={8}>
                <HotkeyInputWrapper
                    label='Hotkey'
                    id="hotkey"
                    placeholder="Enter hotkey..."

                    hotkey={hotkey?.[value]}
                    setHotkey={(hk) => setHotkey?.(value, hk)}

                    disabled={disabled}
                />
            </Grid.Col>
        </Grid>
    )
}