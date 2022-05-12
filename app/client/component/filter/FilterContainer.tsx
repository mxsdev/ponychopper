import { Grid, ScrollArea } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import React, { FunctionComponent, PropsWithChildren, ReactNode, Children } from "react"

interface Props {
    children: ReactNode
}

const Breakpoints = {
    default: {
        size: '375px',
        span: 12
    },
    'md': {
        breakpoint: '800px',
        size: '700px',
        span: 6
    },
    'lg': {
        breakpoint: '1200px',
        size: '1100px',
        span: 4
    }
} as const

export const FilterContainer: FunctionComponent<Props> = (props) => {
    const isMd = useMediaQuery(`(min-width: ${Breakpoints.md.breakpoint})`)
    const isLg = useMediaQuery(`(min-width: ${Breakpoints.lg.breakpoint})`)

    const breakpoint = (() => {
        if(isMd) return 'md'
        if(isLg) return 'lg'
        return 'default'
    })()

    return (<>
            <Grid grow
                sx={(theme) => ({
                    maxWidth: Breakpoints.default.size,
                    ...((['md', 'lg'] as const).reduce((prev, bp) => ({
                        ...prev,
                        [`@media (min-width: ${Breakpoints[bp].breakpoint})`]: {
                            maxWidth: Breakpoints[bp].size
                        }
                    }), {}))
                })}

                mx='auto'
            >
                {Children.map(props.children, (child) => (
                    <Grid.Col 
                        span={Breakpoints[breakpoint].span}  
                    >

                        {child}
                    </Grid.Col>
                ))}
            </Grid>
    </>)
}