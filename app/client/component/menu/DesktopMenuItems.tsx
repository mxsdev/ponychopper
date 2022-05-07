import React, { FunctionComponent } from "react"
import { PushPin } from "./PushPin"
import { Global } from "./Global"
import { isDesktop } from "util/desktop"
import { Gear } from "./Gear"
import { ActionIcon, Stack, MantineProvider, MantineNumberSize } from '@mantine/core'
import { MdSettings, MdOutlineSettings, MdPushPin, MdOutlinePushPin } from 'react-icons/md'
interface OwnProps {
    settingsOpen: boolean,
    toggleSettings: () => void,

    pinned: boolean,
    setPinned: (value: boolean) => void
}

type Props = OwnProps

export default ((props) => {
    if(!isDesktop()) return <></>

    const size = "1.5rem"
    const iconSize: MantineNumberSize = 'lg'

    return (<>
        <Stack
            sx={(theme) => ({
                position: 'absolute',
                top: theme.spacing.sm,
                left: theme.spacing.sm
            })}

            spacing='sm'
        >
                <ActionIcon size={iconSize} onClick={() => props.setPinned(!props.pinned)}>
                    {props.pinned ? <MdPushPin size={size} /> : <MdOutlinePushPin size={size} />}
                </ActionIcon>

                <ActionIcon size={iconSize} onClick={() => props.toggleSettings()}>
                    {props.settingsOpen ? <MdSettings size={size} /> : <MdOutlineSettings size={size} />}
                </ActionIcon>
        </Stack>
    </>)
}) as FunctionComponent<Props>