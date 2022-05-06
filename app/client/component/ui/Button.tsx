import React, { FunctionComponent, PropsWithChildren } from "react"
import cl from 'classnames'

interface OwnProps {
    onClick?: () => void,
    className?: string,
    disabled?: boolean
}

type Props = PropsWithChildren<OwnProps>

export const Button: FunctionComponent<Props> = (props) => {
    return (<>
        <button onClick={props.onClick} className={cl("bg-acc-1 transition-colors duration-75 rounded-md block border-b-2 border-acc-2", { 'hover:bg-acc-3': !props.disabled, 'hover:cursor-not-allowed': props.disabled, 'bg-acc-3': props.disabled }, props.className)}>
            {props.children}
        </button>
    </>)
}