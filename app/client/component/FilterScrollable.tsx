import { Box } from "@mantine/core"
import { ChopFileSummary, FilterOpts } from "chops/chops"
import { FilterUpdateFn } from "client/util/localFilter"
import React, { ComponentProps, FunctionComponent, useState } from "react"
import { Filter } from "./Filter"

type Props = ComponentProps<typeof Filter>

const gradient_size = '5%'

export const FilterScrollable: FunctionComponent<Props> = (props) => {
    const [ topGradient, setTopGradient ] = useState<boolean>()
    
    const onScroll = (event: any) => {
        const { scrollTop } = event.target as HTMLElement

        setTopGradient(scrollTop > 0)
    }

    return (<>
        <Box 
                sx={{
                    height: '100%',
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                    boxSizing: 'border-box',
                    maskImage: `-webkit-gradient(linear, left top, left ${gradient_size}, 
                        from(rgba(0,0,0,0)), to(rgba(0,0,0,1)))`,
                    maskSize: `100% 200%`,
                    maskPosition: topGradient ? '0 0' : `0 calc(${gradient_size} * 2)`,
                    maskRepeat: 'no-repeat',
                    transitionProperty: 'mask-position -webkit-mask-position',
                    transitionDuration: '0.2s'
                }}

                p='sm'

                onScroll={onScroll}
            >
                <Filter
                    {...props} 
                />   
            </Box>
    </>)
}