import { Box, createStyles } from "@mantine/core"
import React, { FunctionComponent, PropsWithChildren } from "react"

type Props = { }

const useStyles = createStyles((theme) => ({
    container: {
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative'
    }
}))

export const SettingsContainer: FunctionComponent<PropsWithChildren<Props>> = ({ children }) => {
    const { classes } = useStyles()

    return (<Box className={classes.container} p="sm">
        {children}
    </Box>)
}