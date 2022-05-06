import React, { FunctionComponent } from "react"
import { PushPin } from "./PushPin"
import { Global } from "./Global"
import { isDesktop } from "util/desktop"
import { Gear } from "./Gear"

interface OwnProps {
    settingsOpen: boolean,
    toggleSettings: () => void,

    pinned: boolean,
    setPinned: (value: boolean) => void
}

type Props = OwnProps

export default ((props) => {
    if(!isDesktop()) return <></>

    const size = "2rem"

    return (<>
        <div className="fixed left-0 top-0 desktop-menu-items">
            <PushPin pinned={props.pinned} onClick={() => props.setPinned(!props.pinned)} size={size} />
            <Gear active={props.settingsOpen} size={size} onClick={() => props.toggleSettings()} />

            {/* <Global globalMode={props.globalMode} setGlobalMode={props.setGlobalMode} /> */}
        </div>
    </>)
}) as FunctionComponent<Props>