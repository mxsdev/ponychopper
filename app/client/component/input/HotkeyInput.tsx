import { useHotkeyInput } from "client/util/hotkeyInput"
import React, { ComponentProps, FunctionComponent } from "react"
import { Hotkey } from "util/hotkeys"
import { InputProps, Input, ActionIcon } from "@mantine/core"
import { MdClear } from 'react-icons/md'
import { ClearButton } from "./ClearButton"

type Props = {
    disabled?: boolean,
    placeholder?: string,
    hotkey?: Hotkey,
    setHotkey?: (hotkey: Hotkey|undefined) => void,

    inputProps?: InputProps<'input'>
}

export const HotkeyInput: FunctionComponent<Props> = ({ hotkey, setHotkey, disabled, placeholder, inputProps }) => {
    const { hotkeyText, onKeyDown, reset } = useHotkeyInput(hotkey, setHotkey)

    return (<Input 
            onKeyDown={onKeyDown}
            value={hotkeyText}

            readOnly={true}

            disabled={disabled}
            placeholder={placeholder}

            rightSection={
                hotkey ? <ClearButton onClick={() => setHotkey?.(undefined)} /> : undefined
            }

            onBlur={reset}

            {...inputProps}
        />)
}