import { Grid, Center, Container, Text, Space } from "@mantine/core"
import { ChopSelection  } from "chops/chops"
import { NUMBER_TO_PITCH } from "util/pitch"
import React, { FunctionComponent } from "react"
import type WaveSurfer from 'wavesurfer.js'
import { WaveFormControls } from "./WaveFormControls"
import { WaveFormPanel } from "./WaveFormPanel"
import path from "path"

type Props = {
    chopLoading: boolean,
    setWS: (ws: WaveSurfer) => void,
    startDrag: () => void,
    chop: () => void,
    next: () => void,
    prev: () => void,
    chopsAvailable: boolean,
    selection: ChopSelection|null,
}

export const ChopSection: FunctionComponent<Props> = ({ chopLoading, setWS, startDrag, chop, next, prev, chopsAvailable, selection }) => {
    return (
        <Container size={350} px='xl' >
            <Grid sx={{height: '170px'}}>
                <Grid.Col span={9} sx={{ height: '100%' }}>
                    <WaveFormPanel 
                        chopLoading={chopLoading}
                        setWS={setWS}
                        startDrag={startDrag}
                    />
                </Grid.Col>

                <Grid.Col span={3} sx={{ height: '100%'}} >
                    <Center sx={{ height: '100%' }}>
                        <WaveFormControls 
                            chop={chop}
                            next={next}
                            prev={prev}
                            chopsAvailable={chopsAvailable}
                        />
                    </Center>
                </Grid.Col>
            </Grid>

            <Space h={"sm"} />

            <Container
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                }}
            >
                {/* { selection &&
                    <Text sx={(theme) => ({ lineHeight: `1.2` })}>
                        "{selection.speech}"
                    </Text>
                } */}

                {  selection &&
                    <Container
                        sx={(theme) => ({
                            display: "flex",
                            columnGap: theme.spacing.xs,
                            flexWrap: "wrap",
                            textAlign: "center",
                            justifyContent: "center",
                            opacity: "65%"
                        })}
                    >
                        <Text size="sm">
                            "{selection.speech}"
                        </Text>
                        <Text size="sm">
                            {selection.speakers.join(",")}
                        </Text>
                        <Text size="sm">
                            {selection.pitches.map(p => p ? NUMBER_TO_PITCH[p.class] + p.octave.toString() : "?").join(",")}
                        </Text>
                        <Text size="sm">
                            {getTimestamp(selection)}
                        </Text>
                    </Container>
                }
                <Text size="xs" sx={{opacity: "50%"}}>
                    {selection && path.basename(selection.chopFile.location.toString())}
                </Text>
            </Container>
        </Container>
    )
}

function getTimestamp(selection: ChopSelection) {
    const start = selection.chopFile.chops[selection.fragmentIndex].pos.start
    const sampleLength = 1 / selection.chopFile.wavMeta.fmt.samplesPerSec

    const seconds = start * sampleLength

    const s = Math.floor(seconds % 60)
    const m = Math.floor(seconds / 60) % 60
    const h = Math.floor(seconds / 3600)

    if(h === 0) {
        return `${m}:${pad(s)}`
    } else {
        return `${h}:${pad(m)}:${pad(s)}`
    }

    function pad(val: number) {
        return val.toString().padStart(2, "0")
    }
}