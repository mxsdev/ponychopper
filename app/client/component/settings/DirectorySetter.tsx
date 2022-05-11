import { Box, createStyles, Text } from "@mantine/core"
import React, { FunctionComponent, PropsWithChildren } from "react"
import { AiOutlineFolderOpen } from "react-icons/ai"

type Props = {
    path: string, title: string, onClick?: () => void
}

const MAX_DIR_CHARS = 50

function shortenPathStr(path: string) {
    if(path.length <= MAX_DIR_CHARS) return path

    return path.slice(0, Math.floor(MAX_DIR_CHARS/2)) + '...' + path.slice(path.length - Math.ceil(MAX_DIR_CHARS/2), path.length)
}

export const useDirectoryStyles = createStyles((theme) => ({
    dir_icons: {
        color: 'rgba(1, 1, 1, 0.2)',
        filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))',
        display: 'block',
        margin: '0 auto'
    },
}))

export const DirectorySetter: FunctionComponent<PropsWithChildren<Props>> = ({path, title, onClick, children}) => {
    const { classes } = useDirectoryStyles()

    return (
        <Box sx={{ '&:hover': { cursor: 'pointer' } }} onClick={onClick}>
            <Text align="center">{title}</Text>

            <AiOutlineFolderOpen
                size={'5em'}
                className={classes.dir_icons}
            />

            <Text align='center' size='xs' sx={{ overflowWrap: 'anywhere', fontFamily: 'monospace' }}>{shortenPathStr(path)}</Text>

            {children}
        </Box>
    )
}