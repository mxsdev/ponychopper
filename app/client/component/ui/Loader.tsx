import React, { FunctionComponent } from "react"

type Props = { }

export const Loader: FunctionComponent<Props> = (props) => {
    return (<>
        <div className="loader mx-auto after:w-spinner after:h-spinner w-spinner h-spinner after:border"></div>
    </>)
}