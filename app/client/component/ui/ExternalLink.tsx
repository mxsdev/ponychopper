import React, { ComponentProps, FunctionComponent, PropsWithChildren } from "react"
import { Anchor, AnchorProps } from '@mantine/core'

type Props = AnchorProps<'a'>

export const ExternalLink: FunctionComponent<Props> = ({href, ...props}) => {
    return (<Anchor 
        onClick={(e: any) => {
            props.onClick?.(e)

            if(href != null) api.openLink(href) 
        }}

        {...props}
    />)
}