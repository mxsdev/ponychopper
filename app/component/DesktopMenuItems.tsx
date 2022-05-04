import React, { FunctionComponent } from "react"
import PushPin from "component/PushPin"
import Global from "component/Global"
import { isDesktop } from "util/desktop"

interface OwnProps {
    globalMode: boolean,
    setGlobalMode: (value: boolean) => void,

    pinned: boolean,
    setPinned: (value: boolean) => void
}

type Props = OwnProps

export default ((props) => {
    if(!isDesktop()) return <></>

    return (<>
        <div className="fixed left-0 top-0 desktop-menu-items">
            <PushPin pinned={props.pinned} setPinned={props.setPinned} />

            <Global globalMode={props.globalMode} setGlobalMode={props.setGlobalMode} />
        </div>
    </>)
}) as FunctionComponent<Props>