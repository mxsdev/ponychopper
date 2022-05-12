import { HotkeyId, HotkeyIDs, hotkeys } from "util/hotkeys"
import React, { FunctionComponent, PropsWithChildren, useEffect, useState } from "react"
import { AddEventListener, PCEventListener, RemoveEventListener } from "./event/events"
import { useChopFileSummary } from "./util/fileSummary"
import { getDirectory, useUserSettings } from "./util/userSettings"
import { MdFolderOpen, MdOutlineKeyboard, MdRefresh } from 'react-icons/md'
import { BiBrush } from 'react-icons/bi'
import { Tabs, Box, Divider, InputWrapper, Grid, ScrollArea, Select, Checkbox, Space, Chips, Chip, TextInput, createStyles, Center, Text, Button } from '@mantine/core'
import { useLocalStorage } from "./util/storage"
import { HotkeyInput } from "./component/input/HotkeyInput"
import { Hotkey } from "util/hotkeys"
import { ImArrowRight } from "react-icons/im"
import { AiOutlineFolderOpen } from 'react-icons/ai'
import cl from 'classnames'
import { HotkeyInputWrapper } from "./component/input/HotkeyInputWrapper"
import { SettingsDirectory } from "./component/settings/SettingsDirectory"
import { SettingsHotkeys } from "./component/settings/SettingsHotkeys"
import { SettingsTheme } from "./component/settings/SettingsTheme"
import { SettingsTabs } from "./component/settings/SettingsTabs"
import { SettingsInfo } from "./component/settings/SettingsInfo"

type Props = {
    
}

export const Settings: FunctionComponent<Props> = (props) => {
    // set title
    useEffect(() => {
        document.title = "🔪 Settings 🐴"
    }, [])

    const { userSettings, updateSettings, setDirectory, setHotkey } = useUserSettings()

    // signal ready status
    useEffect(() => {
        api.signalReady('settings')
    }, [])

    const { loading, chopSummary, reloadFiles } = useChopFileSummary()

    return (<>
        <Box sx={{
            height: '100%',
            width: '100%',
            boxSizing: 'border-box'
        }} py="sm" pr="xs">
            <SettingsTabs 
                content={{
                    directory: (
                        <SettingsDirectory 
                            chopDir={userSettings.chopDir}
                            srcDir={userSettings.srcDir}
                            numFiles={chopSummary?.numFiles}
                            reloadFiles={reloadFiles}
                            setDirectory={setDirectory}
                        />
                    ),
                    hotkeys: (
                        <SettingsHotkeys 
                            globalHotkeys={userSettings.globalHotkeys}
                            localHotkeys={userSettings.localHotkeys}

                            updateHotkeys={setHotkey}

                            globalHotkeysEnabled={userSettings.globalHotkeysEnabled}
                            setGlobalHotkeysEnabled={(val) => updateSettings({ globalHotkeysEnabled: val })}
                        />
                    ),
                    // theme: <SettingsTheme />,
                    info: (
                        <SettingsInfo
                            version={APP_VERSION}
                            issueHref={`${APP_REPOSITORY_URL}/issues`}
                        />
                    )
                }}
            />
        </Box>
    </>)
}