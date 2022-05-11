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
import { WaveFormPanel } from "./component/chop/WaveFormPanel"
import { WaveFormControls } from "./component/chop/WaveFormControls"
import { ChopSection } from "./component/chop/ChopSection"
import { FancyHeader } from "./component/header/FancyHeader"
import { FilterSearch } from "./component/filter/FilterSearch"
import { FilterSyllables } from "./component/filter/FilterSyllables"
import { FilterSpeaker } from "./component/filter/FilterSpeaker"
import { FilterPitch } from "./component/filter/FilterPitch"
import { FilterSentence } from "./component/filter/FilterSentence"
import { FilterMeta } from "./component/filter/FilterMeta"
import { FilterFile } from "./component/filter/FilterFile"

// export default (global: boolean) => !global ? '⏯️ SPACE | 🔄 R | 🔪 C | ⬇️ Ctrl+D' : '🔄 Ctrl+Shift+R | 🔪 Ctrl+Shift+C'

type Props = { }

export default ((props) => {
    const { setWS, chopLoading, controls, isPlaying, startDrag } = useWaveSurfer()

    const { settingsOpened, toggleSettings, ...settings} = useSettings()

    const { chop, prev, next, loading: filesLoading, chopsEnabled, chopSummary } = useChops()

    const loading = chopLoading || filesLoading

    const { userSettings } = useUserSettings()

    useLocalHotkeys(userSettings.localHotkeys, { chop, prev, next, controls })

    const { filter, updateFilter, chopsAvailable } = useFilter()

    return (<>
        <DesktopMenuItems 
            settingsOpen={settingsOpened}
            toggleSettings={toggleSettings}

            pinned={settings.pinned} 
            setPinned={settings.setPinned} 
        />

        <Space h='lg' />

        <FancyHeader />

        <Space h='xl' />
        <Space h='sm' />

        <Container size={350} px='xl' >
            <ChopSection 
                chop={chop} prev={prev} next={next}
                chopLoading={chopLoading}
                chopsAvailable={chopsAvailable}
                setWS={setWS}
                startDrag={startDrag} 
            />
        </Container>

        {(!loading && chopSummary) ?
            <Container>
                {/* Search */}
                <FilterSearch 
                    query={filter?.search?.query ?? ''}
                    type={filter?.search?.type ?? 'fuzzy'}
                    updateSearch={(d) => updateFilter('search', d)}
                />

                {/* Syllables */}
                <FilterSyllables 
                    syllables={filter.syllables}
                    updateSyllables={(d, local) => updateFilter('syllables', d, local)}
                />

                {/* Speaker */}
                <FilterSpeaker 
                    speakers={filter.speaker?.in ?? []}
                    speakerList={chopSummary.speakers}
                    updateSpeakers={(d, local) => updateFilter('speaker', d, local)}
                />

                {/* Pitch */}
                <FilterPitch 
                    classes={filter.pitch?.classes ?? []}
                    nonstrict={!!filter.pitch?.nonstrict}
                    octaves={filter.pitch?.octaves}
                    updatePitch={(d, local) => updateFilter('pitch', d, local)}
                />

                {/* Sentence */}
                <FilterSentence 
                    word={!!filter.sentence?.word}
                    other={!!filter.sentence?.other}
                    numWords={filter.sentence?.numWords}
                    updateSentence={(d, local) => updateFilter('sentence', d, local)}
                />
                
                {/* Meta */}
                <FilterMeta
                    season={filter.meta?.season ?? []}
                    seasonList={chopSummary.meta.seasons}
                    updateMeta={(d, local) => updateFilter('meta', d, local)}
                />

                {/* File */}
                <FilterFile 
                    fileNames={chopSummary.fileNames}
                    files={filter.file ?? []}
                    updateFiles={(d, local) => updateFilter('file', d, local)}
                />
            </Container>
        : '' }
    </>)
}) as FunctionComponent<Props>