import React, { FunctionComponent } from "react"

type Props = {
    globalMode: boolean,
    setGlobalMode: (value: boolean) => void
}

export const Global: FunctionComponent<Props> = ({globalMode, setGlobalMode}) => {
    const size="2rem"

    const cl = "hover:cursor-pointer"

    const onClick = () => setGlobalMode(!globalMode)

    return (globalMode ? 
        <svg xmlns="http://www.w3.org/2000/svg" className={cl} onClick={onClick} height={size} viewBox="0 0 24 24" width={size} fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> : 
        <svg xmlns="http://www.w3.org/2000/svg" className={cl} onClick={onClick} enableBackground="new 0 0 24 24" height={size} viewBox="0 0 24 24" width={size}  fill="#000000"><g><rect fill="none" height="24" width="24"/><path d="M11,8.17L6.49,3.66C8.07,2.61,9.96,2,12,2c5.52,0,10,4.48,10,10c0,2.04-0.61,3.93-1.66,5.51l-1.46-1.46 C19.59,14.87,20,13.48,20,12c0-3.35-2.07-6.22-5-7.41V5c0,1.1-0.9,2-2,2h-2V8.17z M21.19,21.19l-1.41,1.41l-2.27-2.27 C15.93,21.39,14.04,22,12,22C6.48,22,2,17.52,2,12c0-2.04,0.61-3.93,1.66-5.51L1.39,4.22l1.41-1.41L21.19,21.19z M11,18 c-1.1,0-2-0.9-2-2v-1l-4.79-4.79C4.08,10.79,4,11.38,4,12c0,4.08,3.05,7.44,7,7.93V18z"/></g></svg>)
}