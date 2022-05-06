import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from "react"
import WaveSurfer from 'wavesurfer.js'
import { Button } from 'client/component/ui/Button'
import DesktopMenuItems from 'client/component/menu/DesktopMenuItems'
import { useLocalStorage } from "client/util/storage"
import { isDesktop } from "util/desktop"
import type { ChopSelectionListener } from "chops/chopManager"
import { compareSelections } from "util/selection"
import { MainContainer } from "./component/MainContainer"
import { Header } from "./component/Header"
import { WaveSection } from "./component/wave/WaveSection"
import { useSettings } from "./settings"
import { useWaveSurfer } from "./util/audio"
import { useChops } from "./util/chop"

// export default (global: boolean) => !global ? '⏯️ SPACE | 🔄 R | 🔪 C | ⬇️ Ctrl+D' : '🔄 Ctrl+Shift+R | 🔪 Ctrl+Shift+C'

type Props = { }

export default ((props) => {
    const { setWS, chopLoading, controls, isPlaying } = useWaveSurfer()

    const { chop, prev, next } = useChops()

    const settings = useSettings()

    return (<>
        <DesktopMenuItems 
            globalMode={settings.globalMode} 
            setGlobalMode={settings.setGlobalMode} 

            pinned={settings.pinned} 
            setPinned={settings.setPinned} 
        />

        <MainContainer>
            <div className="flex flex-col gap-8">
                <Header />

                <WaveSection 
                    setWS={setWS}
                    chopLoading={chopLoading}
                    
                    onChop={chop}
                    onNext={prev}
                    onPrev={next}
                />
            </div>
        </MainContainer>
    </>)
}) as FunctionComponent<Props>
