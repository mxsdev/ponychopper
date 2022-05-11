import { ActionIcon } from "@mantine/core"
import React, { FunctionComponent } from "react"
import { MdClear } from "react-icons/md"

type Props = {
    onClick?: () => void
}

export const ClearButton: FunctionComponent<Props> = ({ onClick }) => {
    return (<>
        <ActionIcon variant='transparent' onClick={onClick}>
            <MdClear size={'1em'} />
        </ActionIcon>
    </>)
}