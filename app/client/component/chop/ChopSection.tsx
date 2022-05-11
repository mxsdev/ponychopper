import { Grid, Center } from "@mantine/core"
import React, { FunctionComponent } from "react"
import type WaveSurfer from 'wavesurfer.js'
import { WaveFormControls } from "./WaveFormControls"
import { WaveFormPanel } from "./WaveFormPanel"

type Props = {
    chopLoading: boolean,
    setWS: (ws: WaveSurfer) => void,
    startDrag: () => void,
    chop: () => void,
    next: () => void,
    prev: () => void,
    chopsAvailable: boolean,
}

export const ChopSection: FunctionComponent<Props> = ({ chopLoading, setWS, startDrag, chop, next, prev, chopsAvailable }) => {
    return (<>
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
    </>)
}