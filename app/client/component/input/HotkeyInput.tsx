import { useHotkeyInput } from "client/util/hotkeyInput"
import React, { ComponentProps, FunctionComponent } from "react"
import { Hotkey } from "util/hotkeys"
import { InputProps, Input, ActionIcon } from "@mantine/core"
import { MdClear } from 'react-icons/md'

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
                hotkey ? <ActionIcon variant='transparent' onClick={() => setHotkey?.(undefined)}>
                    <MdClear size={'1em'} />
                </ActionIcon> : undefined
            }

            onBlur={reset}

            {...inputProps}
        />)
}