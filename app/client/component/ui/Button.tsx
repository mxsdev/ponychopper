import React, { FunctionComponent, PropsWithChildren } from "react"
import cl from 'classnames'

interface OwnProps {
    onClick?: () => void,
    className?: string
}

type Props = PropsWithChildren<OwnProps>

export const Button: FunctionComponent<Props> = (props) => {
    return (<>
        <button onClick={props.onClick} className={cl("bg-acc-1 hover:bg-acc-3 transition-colors duration-75 rounded-md block border-b-2 border-acc-2", props.className)}>
            {props.children}
        </button>
    </>)
}