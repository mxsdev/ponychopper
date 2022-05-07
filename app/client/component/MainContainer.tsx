import React, { FunctionComponent, PropsWithChildren } from "react"
import cl from 'classnames'

interface OwnProps {
    className?: string
}

type Props = PropsWithChildren<OwnProps>

export const MainContainer: FunctionComponent<Props> = ({children, className}) => {
    return (<>
        <div>
            {children}
        </div>
    </>)
}