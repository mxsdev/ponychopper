import React, { FunctionComponent, useEffect } from "react"

type Props = {
    
}

export const Settings: FunctionComponent<Props> = (props) => {
    useEffect(() => {
        document.title = "🔪 Settings 🐴"

        api.signalReady('settings')
    }, [])

    return (<>
        Settings page XD
    </>)
}