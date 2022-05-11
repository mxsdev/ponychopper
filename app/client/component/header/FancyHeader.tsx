import { Box, createStyles } from "@mantine/core"
import React, { FunctionComponent } from "react"

type Props = {
    
}

const useStyles = createStyles((theme) => ({
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

export const FancyHeader: FunctionComponent<Props> = (props) => {
    const { classes } = useStyles()

    return (<>
        <Box className={classes.headerContainer}>
            <span className={classes.header}>ponychopper</span>
            <span className={classes.subheader}>Because all 🐴🎵 is better with some 🔪</span>
        </Box>
    </>)
}