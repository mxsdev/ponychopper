import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from "react"
import WaveSurfer from 'wavesurfer.js'
import DesktopMenuItems from 'client/component/menu/DesktopMenuItems'
import { useLocalStorage } from "client/util/storage"
import { isDesktop } from "util/desktop"
import { compareSelections } from "util/selection"
import { MainContainer } from "./component/MainContainer"
import { Header } from "./component/Header"
import { useSettings } from "./util/localSettings"
import { useWaveSurfer } from "./util/audio"
import { useChops } from "./util/chop"
import { Grid, Box, Container, Paper, createStyles, Center, Button, AspectRatio, Space, Text, Switch, Slider, RangeSlider, Chips, Chip, Checkbox, Select, NativeSelect, Tooltip, SimpleGrid, TextInput, RadioGroup, Radio, ActionIcon, ScrollArea } from "@mantine/core"
import { WaveForm } from "./component/wave/WaveForm"
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { Hotkey, hotkeyToString, keyboardEventToHotkey, testKeyboardEvent } from "util/hotkeys"
import { useHotkeyInput } from "./util/hotkeyInput"
import { useUserSettings } from "./util/userSettings"
import { useLocalHotkeys } from "./util/localHotkeys"
import { useFilter } from "./util/localFilter"
import { NumericComparison } from "util/types/numeric"
import { useModifierKeys } from "./util/modifierKeys"
import { FilterOpts } from "chops/chops"
import { MdClear } from "react-icons/md"

// export default (global: boolean) => !global ? '⏯️ SPACE | 🔄 R | 🔪 C | ⬇️ Ctrl+D' : '🔄 Ctrl+Shift+R | 🔪 Ctrl+Shift+C'

const useStyles = createStyles((theme) => ({
    wavesurfer: {
        width: '100%',
        height: '100%',
        filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))'
    },
    header: {
        fontFamily: 'aileron, sans-serif',
        fontWeight: 100,
        display: 'block',
        fontSize: '3.5rem',
        marginBottom: '0.25rem',
        textAlign: 'center'
    },
    subheader: {
        fontFamily: 'aileron, sans-serif',
        fontWeight: 400,
        display: 'block',
        fontSize: '1rem',
        textAlign: 'center'
    },
    headerContainer:{ 
        textShadow: '0px 0px 4px rgba(0,0,0,0.1)',

        background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        backgroundSize: '400% 400%',
        animation: 'gradient 10s ease infinite',

        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    }
}))

const keys = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'] as const

function genKey(key: number, scale: string): number[] {
    if(!isFinite(key)) return []

    const mapper = (a: number) => ((a + key - 1) % 12) + 1

    switch(scale) {
        case 'maj':
            return ([ 0, 2, 4, 5, 7, 9, 11 ]).map(mapper)
        case 'min':
            return ([ 0, 2, 3, 5, 7, 8, 10 ]).map(mapper)
    }

    return []
}

type Props = { }

export default ((props) => {
    const { setWS, chopLoading, controls, isPlaying, startDrag } = useWaveSurfer()

    const { settingsOpened, toggleSettings, ...settings} = useSettings()

    const { chop, prev, next, loading: filesLoading, chopsEnabled, chopSummary } = useChops()

    const loading = chopLoading || filesLoading

    const { classes } = useStyles()

    const { userSettings } = useUserSettings()

    useLocalHotkeys(userSettings.localHotkeys, { chop, prev, next, controls })

    const { filter, updateFilter, chopsAvailable } = useFilter()

    const { ctrlKey, altKey } = useModifierKeys()

    return (<>
        <DesktopMenuItems 
            settingsOpen={settingsOpened}
            toggleSettings={toggleSettings}

            pinned={settings.pinned} 
            setPinned={settings.setPinned} 
        />

        <Space h='lg' />

        <Box className={classes.headerContainer}>
            <span className={classes.header}>ponychopper</span>
            <span className={classes.subheader}>Because all 🐴🎵 is better with some 🔪</span>
        </Box>

        <Space h='xl' />
        <Space h='sm' />

        <Container size={350} px='xl' >
            <Grid sx={{height: '170px'}}>
                <Grid.Col span={9} sx={{ height: '100%' }}>
                    <Paper
                        sx={(theme) => ({
                            backgroundColor: theme.colors.bg[0],
                            height: '100%'
                        })} 
                        shadow='md'
                        px='lg'

                        draggable={true}
                        onDragStart={() => startDrag()}
                    >
                        <Center>
                            <WaveForm 
                                chopLoading={chopLoading}
                                setWS={setWS}
                                className={classes.wavesurfer}
                            />
                        </Center>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={3} sx={{ height: '100%'}} >
                    <Center sx={{ height: '100%' }}>
                        <Grid gutter={4} sx={{ width: '100%' }} >
                            <Grid.Col span={12}>
                                <AspectRatio ratio={1}>
                                    <Button sx={(theme) => ({ fontSize: '2.5rem', '&:disabled': { backgroundColor: `${theme.colors.bg[0]} !important` } })} px={0} onClick={() => chop()} disabled={!chopsAvailable} color='bg'>
                                        🔪
                                    </Button>
                                </AspectRatio>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <AspectRatio ratio={1}>
                                    <Button px={0} onClick={() => prev()} color='bg'>
                                        <AiOutlineLeft />
                                    </Button>
                                </AspectRatio>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <AspectRatio ratio={1} onClick={() => next()}>
                                    <Button px={0} color='bg'>
                                        <AiOutlineRight />
                                    </Button>
                                </AspectRatio>
                            </Grid.Col>
                        </Grid>
                    </Center>
                </Grid.Col>
            </Grid>
        </Container>

        {(!loading && chopSummary) ?
            <Container>
                {/* Search */}
                <Box>
                    <Text>Search</Text>
                    <TextInput 
                        size='xs'
                        placeholder='Search query...'

                        rightSection={
                            filter.search?.query ? <ActionIcon variant='transparent' onClick={() => updateFilter({ search: {
                                ...filter.search,
                                query: ''
                            }})}>
                                <MdClear size={'1em'} />
                            </ActionIcon> : undefined
                        }

                        value={filter.search?.query}
                        onChange={(e) => {
                            updateFilter({ search: {
                                ...filter.search,
                                query: e.target.value
                            }})
                        }}
                    />

                    <RadioGroup size='sm'
                        value={filter.search?.type ?? 'fuzzy'}
                        onChange={(v) => updateFilter({ search: {
                            ...filter.search,
                            type: v as NonNullable<FilterOpts['search']>['type']
                        }})}
                    >
                        <Radio value="fuzzy" label="Fuzzy" />
                        <Radio value="exact" label="Exact" />
                        <Radio value="regex" label="RegEx" />
                    </RadioGroup>
                </Box>

                {/* Syllables */}
                <Box>
                    <Text>Syllables</Text>
                    <HybridSlider 
                        value={filter.syllables}
                        setValue={(v, local) => updateFilter({ syllables: v }, local)}

                        max={16}
                        marks={[0, 4, 8, 12, 16].map(v => ({ value: v, label: String(v) }))}
                    />
                </Box>

                <Space h='md' />

                {/* Speaker */}
                <Box>
                    <Text>Speaker</Text>

                    <Chips size="xs" value={filter.speaker?.in.map((s) => {
                        if(s == null) return ''
                        return s
                    }) ?? []}
                    multiple={true}

                    onChange={(v) => {
                        if(typeof v === 'string') return
                        updateFilter({
                            speaker: {
                                ...filter.speaker,
                                in: v
                            }
                        })
                    }}
                    >
                        {chopSummary.speakers.map((speaker) => (
                            <Chip value={speaker} key={speaker ?? '__undefined'} onChange={(c) => {
                            }}>{speaker ?? 'Unknown'}</Chip>
                        ))}
                    </Chips>
                </Box>

                {/* Pitch */}
                <Box>
                    <Text>Pitch</Text>

                    <Grid>
                        {keys.map((val, i) => (
                            <Grid.Col span={2} key={val}>
                                <Checkbox 
                                    label={val} 
                                    size='xs' 
                                    checked={filter.pitch?.classes?.includes(i+1)}
                                    onChange={(e) => {
                                        const v = e.target.checked

                                        if(ctrlKey || altKey) {
                                            const plen = filter.pitch?.classes?.filter(p => p !== undefined && p !== i+1)?.length ?? 0

                                            updateFilter({
                                                pitch: {
                                                    ...filter.pitch,
                                                    classes: [
                                                        i+1,
                                                        ...((plen <= 1 && !altKey) ? keys.map((_, i) => i+1) : [])
                                                    ]
                                                }
                                            })

                                            return
                                        }

                                        updateFilter({
                                            pitch: {
                                                ...filter.pitch,
                                                classes: [ 
                                                    ...(filter.pitch?.classes?.filter(c => c !== i+1) ?? []),
                                                    ...(v ? [i+1] : [])
                                                ]
                                            }
                                        })
                                    }}
                                />
                            </Grid.Col>
                        ))}
                    </Grid>

                    <Space h='xs' />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={(theme) => ({display: 'flex', gap: theme.spacing.xl})}>
                            <Checkbox 
                                size='xs'
                                label='None'
                                
                                checked={filter.pitch?.classes?.includes(undefined)}
                                onChange={(e) => {
                                    const v = e.target.checked

                                    updateFilter({
                                        pitch: {
                                            ...filter.pitch,
                                            classes: [ 
                                                ...(filter.pitch?.classes?.filter(c => c !== undefined) ?? []),
                                                ...(v ? [undefined] : [])
                                            ]
                                        }
                                    })
                                }}
                            />

                            <Switch
                                size='xs'
                                checked={!filter.pitch?.nonstrict}

                                onChange={({target: { checked }}) => {
                                    updateFilter({
                                        pitch: {
                                            ...filter.pitch,
                                            nonstrict: !checked
                                        }
                                    })
                                }}

                                label='Strict'
                            />
                        </Box>

                        {/* TODO: style this glassy */}
                        <NativeSelect
                            variant='filled'
                            size='xs'
                            
                            data={keys.flatMap(((key, i) => [
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
                                
                                updateFilter({
                                    pitch: {
                                        ...filter.pitch,
                                        classes: genKey(Number(key), mode)
                                    }
                                })
                            }}
                        />
                    </Box>

                    <Text size='xs' align='right'>Octave</Text>
                    <HybridSlider 
                        value={filter.pitch?.octaves}
                        setValue={(octaves) => {
                            updateFilter({
                                pitch: {
                                    ...filter.pitch,
                                    octaves
                                }
                            })
                        }}

                        max={12}
                        marks={[0, 4, 8, 12].map(i => ({ value: i, label: String(i) }))}
                    />
                </Box>

                {/* Sentence */}
                <Box>
                    <Text>Sentence</Text>

                    <SimpleGrid cols={6}>
                        <Checkbox size='xs' label='Words' 
                            checked={filter.sentence?.word} 
                            onChange={({ target: { checked } }) => {
                                updateFilter({
                                    sentence: {
                                        ...filter.sentence,
                                        word: checked
                                    }
                                })
                            }}
                        />
                        <Checkbox size='xs' label='Non-Words' 
                            checked={filter.sentence?.other} 
                            onChange={({ target: { checked } }) => {
                                updateFilter({
                                    sentence: {
                                        ...filter.sentence,
                                        other: checked
                                    }
                                })
                            }}
                        />
                    </SimpleGrid>

                    <Text size="xs" align="right">Number of Words</Text>
                    
                    <HybridSlider 
                        max={16}
                        marks={[0, 4, 8, 12, 16].map(i => ({ value: i, label: String(i) }))}

                        value={filter.sentence?.numWords}

                        setValue={(v) => {
                            updateFilter({
                                sentence: {
                                    ...filter.sentence,
                                    numWords: v
                                }
                            })
                        }}
                    />
                </Box>
                
                {/* Meta */}
                <Box>
                    <Text>Meta</Text>

                    <Text size='xs'>Season</Text>
                    <Chips size='xs'
                        multiple
                        value={(filter.meta?.season ?? []).map((s) => {
                            if(!s) return '__unknown'
                            return String(s)
                        })}

                        onChange={(v) => {
                            updateFilter({
                                meta: {
                                    ...filter.meta,
                                    season: v.map((s) => {
                                        if(s === '__unknown') return undefined
                                        return Number(s)
                                    })
                                }
                            })
                        }}
                    >
                        {chopSummary.meta.seasons.map(s => (
                            <Chip value={s ? String(s) : '__unknown'}>{s ? String(s) : 'Unknown'}</Chip>
                        ))}
                    </Chips>
                </Box>

                {/* File */}
                <Box>
                    <Text>File</Text>

                    <TextInput 
                        placeholder='Filter...'
                        size='xs'
                    />

                    <ScrollArea sx={{ maxHeight: '300px' }}>
                        {chopSummary.fileNames.map(f => <Checkbox 
                            label={f}

                            checked={filter.file?.includes(f)}

                            onChange={({target: { checked } }) => {
                                updateFilter({
                                    file: [
                                        ...((filter.file ?? []).filter(name => name !== f)),
                                        ...(checked ? [ f ] : [])
                                    ]
                                })
                            }}
                        />)}
                    </ScrollArea>
                </Box>
            </Container>
        : '' }
    </>)
}) as FunctionComponent<Props>

const HybridSlider: FunctionComponent<{ value?: NumericComparison, setValue?: (val: NumericComparison, local?: boolean) => void, min?: number, max: number, step?: number, minRange?: number, marks: {
    value: number;
    label?: React.ReactNode;
}[] }> = ({ value, setValue, min=0, max, step=1, minRange=1, marks }) => {
    // const min = 0
    // const max = 16
    // const step = 1
    // const minRange = 1
    // const marks = [0, 4, 8, 12, 16].map(i => ({ value: i, label: String(i) }))

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

    return (  
        <Box
            sx={{
                display: 'flex'
            }}
        >
            <Switch
                disabled={disabled}

                checked={isRange}
                onChange={(e) => setMode(e.currentTarget.checked)}

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
        </Box>)
}