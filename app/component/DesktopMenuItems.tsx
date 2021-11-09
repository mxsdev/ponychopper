import React, { FunctionComponent } from "react"
import config from "config"
import PushPin from "component/PushPin"
import Global from "component/Global"

interface OwnProps {
    globalMode: boolean,
    setGlobalMode: (value: boolean) => void
}

type Props = OwnProps

export default ((props) => {
    if(!config.desktop) return <></>

    return (<>
        <div className="fixed left-0 top-0 desktop-menu-items">
            <PushPin />

            <Global globalMode={props.globalMode} setGlobalMode={props.setGlobalMode} />
        </div>
    </>)
}) as FunctionComponent<Props>