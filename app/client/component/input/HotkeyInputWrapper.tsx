import { InputWrapper } from "@mantine/core"
import React, { FunctionComponent } from "react"
import { Hotkey } from "util/hotkeys"
import { HotkeyInput } from "./HotkeyInput"

type Props = {
    label: string,
    id: string,
    placeholder?: string,

    disabled?: boolean

    hotkey?: Hotkey,
    setHotkey?: (hotkey: Hotkey|undefined) => void
}

export const HotkeyInputWrapper: FunctionComponent<Props> = ({label, id, placeholder = "Enter shortcut...", hotkey, setHotkey, disabled}) => {
    return (<InputWrapper id={id}
        label={label}
        size='xs'      
    >
        <HotkeyInput 
            inputProps={{
                id,
                size: 'xs',
                disabled,
            }}
            placeholder={placeholder}

            hotkey={hotkey}
            setHotkey={setHotkey}
        />
    </InputWrapper>)
}