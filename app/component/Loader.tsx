import React, { FunctionComponent } from "react"

interface OwnProps {
    
}

type Props = OwnProps

export default ((props) => {
    return (<>
        <div className="loader mx-auto after:w-spinner after:h-spinner w-spinner h-spinner after:border"></div>
    </>)
}) as FunctionComponent<Props>