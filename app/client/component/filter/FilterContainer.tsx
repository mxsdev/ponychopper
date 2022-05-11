import { Grid, ScrollArea } from "@mantine/core"
import React, { FunctionComponent, PropsWithChildren, ReactNode, Children } from "react"

interface Props {
    children: ReactNode
}

export const FilterContainer: FunctionComponent<Props> = (props) => {
    return (<>
            <Grid>
                {Children.map(props.children, (child) => (
                    <Grid.Col span={12}>
                        {child}
                    </Grid.Col>
                ))}
            </Grid>
    </>)
}