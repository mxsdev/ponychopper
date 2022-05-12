import { Anchor, Space, Text } from "@mantine/core"
import React, { FunctionComponent } from "react"
import { ExternalLink } from "../ui/ExternalLink"
import { SettingsContainer } from "./SettingsContainer"

type Props = {
    version: string,
    issueHref: string
}

export const SettingsInfo: FunctionComponent<Props> = (props) => {
    return (<>
        <SettingsContainer>
            <Text size='sm' weight='bold'>Version: {props.version}</Text>

            <Space h='sm' />

            <Text size='sm'
            >Have an issue or suggestion? Submit it <ExternalLink size='sm' href={props.issueHref}>here</ExternalLink>!</Text>
        </SettingsContainer>
    </>)
}