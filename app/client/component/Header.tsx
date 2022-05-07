import React, { FunctionComponent } from "react"

type Props = {
    className?: string
}

export const Header: FunctionComponent<Props> = ({ className }) => {
    return (<>
        <div className={className}>
            <p>🔪.🐴</p>
            <p>Because all 🐴🎵 is better with some 🔪</p>
        </div> 
    </>)
}