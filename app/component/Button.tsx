import React, { FunctionComponent } from "react"

interface OwnProps {
    onClick?: () => void
}

type Props = OwnProps

export default ((props) => {
    return (<>
        <button onClick={props.onClick} className="p-3 bg-acc-1 hover:bg-acc-3 transition-colors duration-75 rounded-md block border-b-2 border-acc-2">
            {props.children}
        </button>
    </>)
}) as FunctionComponent<Props>