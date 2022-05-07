import { UserSettingsData } from "electron/main/settings"
import React, { FunctionComponent, useEffect, useState } from "react"
import { AddEventListener, PCEventListener, RemoveEventListener } from "./event/events"
import { useChopFileSummary } from "./util/fileSummary"
import { getDirectory, useUserSettings } from "./util/userSettings"

type Props = {
    
}

export const Settings: FunctionComponent<Props> = (props) => {
    // set title
    useEffect(() => {
        document.title = "🔪 Settings 🐴"
    }, [])

    const { userSettings, updateSettings } = useUserSettings()

    // signal ready status
    useEffect(() => {
        api.signalReady('settings')
    }, [])

    const { loading, chopSummary } = useChopFileSummary()

    const chopDirEnabled = !!userSettings.chopDir
    const srcDirEnabled = !!userSettings.srcDir

    return (<>
        {/* Settings page
        <br/> <br/>

        <strong>Chop directory:</strong>
        <p>{userSettings.chopDir}</p> */}
        {/* <Button onClick={() => {
            getDirectory({ defaultDirectory: userSettings.chopDir })
                .then(({ path }) => {
                    if(path) updateSettings({ chopDir: path })
                })
        }}>
            select folder
        </Button> */}
        {/* <br/> <br />

        <strong>Source directory:</strong>
        <p>{userSettings.srcDir}</p> */}
        {/* <Button onClick={() => {
            getDirectory({ defaultDirectory: userSettings.srcDir })
                .then(({ path }) => {
                    if(path) updateSettings({ srcDir: path })
                })
        }}>
            select folder
        </Button> */}
        {/* <p>{loading ? 'Loading...' : `Found ${chopSummary?.numFiles} files!`}</p>
        <br/> */}
    </>)
}