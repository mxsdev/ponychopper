import { Box } from "@mantine/core"
import React, { FunctionComponent, PropsWithChildren } from "react"
import { Text } from '@mantine/core'

interface OwnProps {
    header: string
}

type Props = PropsWithChildren<OwnProps>

export const FilterSection: FunctionComponent<Props> = (props) => {
    return (<>
        <Box>
            <Text>{props.header}</Text>
            {props.children}
        </Box>
    </>)
}