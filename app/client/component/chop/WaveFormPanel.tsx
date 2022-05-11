import { Paper, Center, createStyles } from "@mantine/core"
import React, { FunctionComponent } from "react"
import { WaveForm } from "../wave/WaveForm"

type Props = {
    startDrag: () => void,
    chopLoading: boolean,
    setWS: (ws: WaveSurfer) => void,
}

const useStyles = createStyles((theme) => ({
    wavesurfer: {
        width: '100%',
        height: '100%',
        filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))'
    }
}))

export const WaveFormPanel: FunctionComponent<Props> = ({ startDrag, chopLoading, setWS }) => {
    const { classes } = useStyles()

    return (<>
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
    </>)
}