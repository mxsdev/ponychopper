import React, { FunctionComponent, useEffect } from "react"
import { useLocalStorage } from "client/util/storage"
import { isDesktop } from "util/desktop"

// import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
// import PushPinIcon from '@mui/icons-material/PushPin';

type Props = {
    pinned: boolean,
    setPinned: (pinned: boolean) => void
}

export const PushPin: FunctionComponent<Props> = ({pinned, setPinned}) => {
    return (<>
        <Icon pinned={pinned} onClick={() => setPinned(!pinned)} />
    </>)
}

const Icon: FunctionComponent<{pinned: boolean, onClick?: () => void}> = ({pinned, onClick}) => {

    const cl = "hover:cursor-pointer"

    const size="2rem"

    const click = () => onClick?.()

    return pinned ? 
    <svg onClick={click} className={cl} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height={size} viewBox="0 0 24 24" width={size} fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><path d="M16,9V4l1,0c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H7C6.45,2,6,2.45,6,3v0 c0,0.55,0.45,1,1,1l1,0v5c0,1.66-1.34,3-3,3h0v2h5.97v7l1,1l1-1v-7H19v-2h0C17.34,12,16,10.66,16,9z" fillRule="evenodd"/></g></svg> : 
    (<svg onClick={click} className={cl} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height={size} viewBox="0 0 24 24" width={size} fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><path d="M14,4v5c0,1.12,0.37,2.16,1,3H9c0.65-0.86,1-1.9,1-3V4H14 M17,2H7C6.45,2,6,2.45,6,3c0,0.55,0.45,1,1,1c0,0,0,0,0,0l1,0v5 c0,1.66-1.34,3-3,3v2h5.97v7l1,1l1-1v-7H19v-2c0,0,0,0,0,0c-1.66,0-3-1.34-3-3V4l1,0c0,0,0,0,0,0c0.55,0,1-0.45,1-1 C18,2.45,17.55,2,17,2L17,2z"/></g></svg>)
}
    