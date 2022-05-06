import React, { FunctionComponent } from "react"

type Props = {
    className?: string
}

export const Header: FunctionComponent<Props> = ({ className }) => {
    return (<>
        <div className={className}>
            <p className="text-center text-5xl select-none">🔪.🐴</p>
            <p className="mt-6 text-center body-text">Because all 🐴🎵 is better with some 🔪</p>
        </div> 
    </>)
}