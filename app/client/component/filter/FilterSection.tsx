import { Box, createStyles, Paper, Space } from "@mantine/core"
import React, { FunctionComponent, PropsWithChildren } from "react"
import { Text } from '@mantine/core'
import cl from 'classnames'

interface OwnProps {
    header: string,
    className?: string,
}

type Props = PropsWithChildren<OwnProps>

const useStyles = createStyles((theme) => ({
    wrapper: {
        backgroundColor: theme.colors.bg[0],
        padding: theme.spacing.sm,
        boxShadow: theme.shadows.sm
    }
}))

export const FilterSection: FunctionComponent<Props> = (props) => {
    const { classes } = useStyles()

    return (<>
        <Paper
            className={cl(classes.wrapper, props.className)}
        >
            <Text>{props.header}</Text>

            <Space h='xs' />

            {props.children}
        </Paper>
    </>)
}