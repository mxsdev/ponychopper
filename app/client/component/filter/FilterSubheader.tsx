import React, { FunctionComponent } from "react"
import { Text } from '@mantine/core'

type Props = {
    text: string,
    align?: 'left'|'right'
}

export const FilterSubheader: FunctionComponent<Props> = ({text, align='right'}) => {
    return (<>
        <Text size='sm' align={align}>{text}</Text>
    </>)
}