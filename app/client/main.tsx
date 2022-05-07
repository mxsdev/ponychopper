import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from "react"
import WaveSurfer from 'wavesurfer.js'
import DesktopMenuItems from 'client/component/menu/DesktopMenuItems'
import { useLocalStorage } from "client/util/storage"
import { isDesktop } from "util/desktop"
import { compareSelections } from "util/selection"
import { MainContainer } from "./component/MainContainer"
import { Header } from "./component/Header"
import { WaveSection } from "./component/wave/WaveSection"
import { useSettings } from "./util/localSettings"
import { useWaveSurfer } from "./util/audio"
import { useChops } from "./util/chop"
import { Grid, Box, Container, Paper, createStyles, Center, Button, AspectRatio, Space } from "@mantine/core"
import { WaveForm } from "./component/wave/WaveForm"
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

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

type Props = { }

export default ((props) => {
    const { setWS, chopLoading, controls, isPlaying, startDrag } = useWaveSurfer()

    const { settingsOpened, toggleSettings, ...settings} = useSettings()

    const { chop, prev, next, loading: filesLoading, chopsEnabled } = useChops()

    const loading = chopLoading || filesLoading

    const { classes } = useStyles()

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
                        onDragStart={() => console.log('drag start')}
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
                                    <Button sx={(theme) => ({ fontSize: '2.5rem' })} px={0} onClick={() => chop()}>
                                        🔪
                                    </Button>
                                </AspectRatio>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <AspectRatio ratio={1}>
                                    <Button px={0} onClick={() => prev()}>
                                        <AiOutlineLeft />
                                    </Button>
                                </AspectRatio>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <AspectRatio ratio={1} onClick={() => next()}>
                                    <Button px={0}>
                                        <AiOutlineRight />
                                    </Button>
                                </AspectRatio>
                            </Grid.Col>
                        </Grid>
                    </Center>
                </Grid.Col>
            </Grid>
        </Container>

        {/* <MainContainer>
            <div className="flex flex-col gap-8">
                <Header />

                <WaveSection 
                    setWS={setWS}
                    chopLoading={loading}
                    
                    onChop={chop}
                    onNext={next}
                    onPrev={prev}

                    onDragStart={() => startDrag()}

                    chopsEnabled={!!chopsEnabled}
                />
            </div>
        </MainContainer> */}
    </>)
}) as FunctionComponent<Props>
