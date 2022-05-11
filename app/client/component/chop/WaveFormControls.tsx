import { Grid, AspectRatio, Button } from "@mantine/core"
import React, { FunctionComponent } from "react"
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"

type Props = {
    chopsAvailable: boolean,
    chop: () => void,
    next: () => void,
    prev: () => void
}

export const WaveFormControls: FunctionComponent<Props> = ({ chopsAvailable, chop, next, prev }) => {
    return (<>
        <Grid gutter={4} sx={{ width: '100%' }} >
            <Grid.Col span={12}>
                <AspectRatio ratio={1}>
                    <Button 
                        sx={(theme) => ({ fontSize: '2.5rem', '&:disabled': { backgroundColor: `${theme.colors.bg[0]} !important` } })} 
                        px={0} 
                        onClick={() => chop()} disabled={!chopsAvailable} 
                        color='bg'
                    >
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
    </>)
}