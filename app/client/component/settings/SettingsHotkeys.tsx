import { Divider, Checkbox, Space } from "@mantine/core"
import React, { FunctionComponent } from "react"
import { Hotkey, HotkeyId, HotkeyList } from "util/hotkeys"
import { HotkeySetter } from "./HotkeySetter"
import { SettingsContainer } from "./SettingsContainer"

type Props = {
    localHotkeys: HotkeyList,
    globalHotkeys: HotkeyList,

    globalHotkeysEnabled: boolean,
    setGlobalHotkeysEnabled: ( val: boolean ) => void

    updateHotkeys: (type: 'local'|'global', id: HotkeyId, hk: Hotkey|undefined) => void,
}

export const SettingsHotkeys: FunctionComponent<Props> = ({ localHotkeys, globalHotkeys, globalHotkeysEnabled, updateHotkeys, setGlobalHotkeysEnabled }) => {
    return (<SettingsContainer>
        <Divider mb="xs" labelPosition="right" label="Local Shortcuts" />

        <HotkeySetter 
            hotkey={localHotkeys}
            setHotkey={(id, hk) => updateHotkeys('local', id, hk)}
        />

        <Divider my="xs" mt='xl' labelPosition="right" label="Global Shortcuts" />

        <Checkbox 
            size='xs'
            label="Enable Global Shortcuts"

            checked={globalHotkeysEnabled}
            onChange={({ target: { checked } }) => setGlobalHotkeysEnabled(checked)}
        />

        <Space h='xs' />

        <HotkeySetter 
            hotkey={globalHotkeys}
            disabled={globalHotkeysEnabled}
            setHotkey={(id, hk) => updateHotkeys('global', id, hk)}
        />
        
    </SettingsContainer>)
}