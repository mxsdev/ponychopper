import { Tabs } from "@mantine/core"
import { useLocalStorage } from "client/util/storage"
import React, { FunctionComponent, Component, ReactNode } from "react"
import { BiBrush } from "react-icons/bi"
import { MdFolderOpen, MdOutlineKeyboard } from "react-icons/md"

const ICON_SIZE = '1.5rem'

const SettingsTabMeta = {
    directory: { label: 'Directory', icon: MdFolderOpen },
    hotkeys: { label: 'Hotkeys', icon: MdOutlineKeyboard },
    theme: { label: 'Theme', icon: BiBrush }
} as const

type TabIds = keyof typeof SettingsTabMeta

type Props = {
    content: { [index in TabIds]: ReactNode }
}

export const SettingsTabs: FunctionComponent<Props> = ({ content }) => {
    const [ activeTab, setActiveTab ] = useLocalStorage<number>('activeTab', 1)

    return (<Tabs orientation='vertical' sx={{ height: '100%' }} active={activeTab} onTabChange={setActiveTab} styles={ (theme) => ({
        body: {
            width: '100%'
        }
    })} >
        {(Object.keys(SettingsTabMeta) as TabIds[]).map(id => {
            const IconComp = SettingsTabMeta[id].icon

            return (
                <Tabs.Tab label={SettingsTabMeta[id].label} icon={<IconComp size={ICON_SIZE} />}>
                    {content[id]}
                </Tabs.Tab>
            )
        })}
    </Tabs>)
}