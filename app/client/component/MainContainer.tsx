import React, { FunctionComponent, PropsWithChildren } from "react"
import cl from 'classnames'

interface OwnProps {
    className?: string
}

type Props = PropsWithChildren<OwnProps>

export const MainContainer: FunctionComponent<Props> = ({children, className}) => {
    return (<>
        <div className={cl("w-full max-w-[500px] mx-auto p-4", className)}>
            {children}
        </div>
    </>)
}