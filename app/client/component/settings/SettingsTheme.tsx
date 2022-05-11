import { Chip, Chips, Divider } from "@mantine/core"
import React, { FunctionComponent } from "react"
import { SettingsContainer } from "./SettingsContainer"

type Props = {
    
}

export const SettingsTheme: FunctionComponent<Props> = (props) => {
    return (<SettingsContainer>
        <Divider mb="xs" labelPosition="right" label="Title Gradient" />
        
        {/* <TextInput size="xs" placeholder="CSS compatible background string..." /> */}

    </SettingsContainer>)
}