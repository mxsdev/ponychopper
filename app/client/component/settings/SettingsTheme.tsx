import { Chip, Chips, Divider } from "@mantine/core"
import React, { FunctionComponent } from "react"
import { SettingsContainer } from "./SettingsContainer"

type Props = {
    
}

export const SettingsTheme: FunctionComponent<Props> = (props) => {
    return (<SettingsContainer>
        <Divider mb="xs" labelPosition="right" label="Title Gradient" />
        
        <Chips size='xs'>
            <Chip value='rainbow'>Rainbow</Chip>
            <Chip value='trans'>Trans</Chip>
            <Chip value='bisexual'>Bisexual</Chip>
            <Chip value='other'>Other</Chip>
        </Chips>

        {/* <TextInput size="xs" placeholder="CSS compatible background string..." /> */}

    </SettingsContainer>)
}