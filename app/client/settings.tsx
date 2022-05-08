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

type Props = {
    
}

const ICON_SIZE = '1.5rem'

const useStyles = createStyles((theme) => ({
    dir_icons: {
        color: 'rgba(1, 1, 1, 0.2)',
        filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))',
        display: 'block',
        margin: '0 auto'
    },
    dir_icon_dir: {
        // marginLeft: '0.1rem'
    }
}))

export const Settings: FunctionComponent<Props> = (props) => {
    // set title
    useEffect(() => {
        document.title = "🔪 Settings 🐴"
    }, [])

    const { userSettings, updateSettings, setDirectory } = useUserSettings()

    // signal ready status
    useEffect(() => {
        api.signalReady('settings')
    }, [])

    const { loading, chopSummary, reloadFiles } = useChopFileSummary()

    const chopDirEnabled = !!userSettings.chopDir
    const srcDirEnabled = !!userSettings.srcDir

    const [ activeTab, setActiveTab ] = useLocalStorage<number>('activeTab', 1)

    const { classes } = useStyles()

    return (<>
        <Box sx={{
            height: '100%',
            width: '100%',
            boxSizing: 'border-box'
        }} py="sm" pr="xs">
                <Tabs orientation='vertical' sx={{ height: '100%' }} active={activeTab} onTabChange={setActiveTab} styles={ (theme) => ({
                    tabsListWrapper: {
                        // padding: '1rem 0'
                    },
                    body: {
                        width: '100%'
                    }
                })} >
                    <Tabs.Tab label='Directory' icon={<MdFolderOpen size={ICON_SIZE} />}>
                        <SettingsContainer>
                            <Button color="dark" leftIcon={<MdRefresh size='1.25em'/>} size='sm' compact
                                variant='subtle'
                                sx={(theme) => ({
                                    position: 'absolute',
                                    right: 0,
                                    bottom: 0,
                                    '&:hover': {
                                        backgroundColor: theme.colors.bg2[0]
                                    }
                                })}
                                onClick={() => reloadFiles()}
                            >
                                Reload
                            </Button>

                            <Center sx={{height: '100%'}}>
                                <Grid>
                                    <Grid.Col span={4}>
                                        <Center>
                                            <DirectorySetter 
                                                title='Source Files'
                                                path={userSettings.srcDir}
                                                onClick={() => setDirectory('src')}
                                            >
                                                <Space h='xs' />

                                                <Text size='xs' weight="bold" align="center">
                                                    {!loading ? `Found ${chopSummary?.numFiles ?? 0} file(s)` : `Loading...`}
                                                </Text>
                                            </DirectorySetter>
                                        </Center>
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Center sx={{height: '100%'}}>
                                            <ImArrowRight 
                                                size={'5em'}
                                                className={classes.dir_icons}
                                            />
                                        </Center>
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Center>
                                            <DirectorySetter 
                                                title='Chop Directory'
                                                path={userSettings.chopDir}
                                                onClick={() => setDirectory('chop')}
                                            />
                                        </Center>
                                    </Grid.Col>
                                </Grid>
                            </Center>
                        </SettingsContainer>
                    </Tabs.Tab>
                    <Tabs.Tab label='Hotkeys' icon={<MdOutlineKeyboard size={ICON_SIZE} />}>
                        <SettingsContainer>
                            <Divider mb="xs" labelPosition="right" label="Local Shortcuts" />

                            <HotkeySetter 
                                hotkey={userSettings?.localHotkeys}
                                setHotkey={(id, hk) => updateSettings({
                                    localHotkeys: {
                                        ...userSettings?.localHotkeys,
                                        [id]: hk
                                    }
                                })}
                            />

                            <Divider my="xs" mt='xl' labelPosition="right" label="Global Shortcuts" />

                            <Checkbox 
                                size='xs'
                                label="Enable Global Shortcuts"

                                checked={userSettings.globalHotkeysEnabled}
                                onChange={(e) => {
                                    updateSettings({ globalHotkeysEnabled: e.target.checked })
                                }}
                            />

                            <Space h='xs' />

                            <HotkeySetter 
                                hotkey={userSettings?.globalHotkeys}
                                disabled={!userSettings.globalHotkeysEnabled}
                                setHotkey={(id, hk) => updateSettings({
                                    globalHotkeys: {
                                        ...userSettings?.globalHotkeys,
                                        [id]: hk
                                    }
                                })}
                            />
                            
                        </SettingsContainer>
                    </Tabs.Tab>
                    <Tabs.Tab label='Theme' icon={<BiBrush size={ICON_SIZE} />}>
                        <SettingsContainer>
                            <Divider mb="xs" labelPosition="right" label="Title Gradient" />
                            
                            <Chips styles={ (theme) => ({ 
                                    label: { 
                                        background: `${theme.colors.bg2[0]} !important`,
                                        ':not(input:checked+&)': {
                                            borderColor: `rgba(1, 1, 1, 0)`
                                        }
                                    },
                                    
                                }) } size='xs'>
                                <Chip value='rainbow'>Rainbow</Chip>
                                <Chip value='trans'>Trans</Chip>
                                <Chip value='bisexual'>Bisexual</Chip>
                                <Chip value='other'>Other</Chip>
                            </Chips>

                            {/* <TextInput size="xs" placeholder="CSS compatible background string..." /> */}

                        </SettingsContainer>
                    </Tabs.Tab>
                </Tabs>
        </Box>
    </>)
}

const HotkeySetter: FunctionComponent<{
    disabled?: boolean,
    hotkey?: { [index in HotkeyId]?: Hotkey },
    setHotkey?: (id: HotkeyId, hotkey: Hotkey|undefined) => void
}> = ({disabled, hotkey, setHotkey}) => {
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
                <ShortcutInput
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

const ShortcutInput: FunctionComponent<{
    label: string,
    id: string,
    placeholder?: string,

    disabled?: boolean

    hotkey?: Hotkey,
    setHotkey?: (hotkey: Hotkey|undefined) => void
}> = ({label, id, placeholder = "Enter shortcut...", hotkey, setHotkey, disabled}) => (
    <InputWrapper id={id}
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
    </InputWrapper>
)

const SettingsContainer: FunctionComponent<PropsWithChildren<{}>> = ({children}) => (<Box sx={{
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative'

}} p="sm">
    {children}
</Box>
)

const MAX_DIR_CHARS = 50

function shortenPathStr(path: string) {
    if(path.length <= MAX_DIR_CHARS) return path

    return path.slice(0, Math.floor(MAX_DIR_CHARS/2)) + '...' + path.slice(path.length - Math.ceil(MAX_DIR_CHARS/2), path.length)
}

const DirectorySetter: FunctionComponent<PropsWithChildren<{path: string, title: string, onClick?: () => void}>> = ({path, title, onClick, children}) => {
    const { classes } = useStyles()

    return (
        <Box sx={{ '&:hover': { cursor: 'pointer' } }} onClick={onClick}>
            <Text align="center">{title}</Text>

            <AiOutlineFolderOpen
                size={'5em'}
                className={cl(classes.dir_icons, classes.dir_icon_dir)}
            />

            <Text align='center' size='xs' sx={{ overflowWrap: 'anywhere', fontFamily: 'monospace' }}>{shortenPathStr(path)}</Text>

            {children}
        </Box>
    )
}