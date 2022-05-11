import { Button, Center, createStyles, Grid, Space, Text } from "@mantine/core"
import React, { FunctionComponent } from "react"
import { ImArrowRight } from "react-icons/im"
import { MdRefresh } from "react-icons/md"
import { DirectorySetter, useDirectoryStyles } from "./DirectorySetter"
import { SettingsContainer } from "./SettingsContainer"

type Props = {
    reloadFiles: () => void,
    srcDir: string,
    chopDir: string,
    setDirectory: (type: 'src'|'chop') => void,

    numFiles: number|undefined,
    loading?: boolean
}

export const SettingsDirectory: FunctionComponent<Props> = ({ reloadFiles, srcDir, chopDir, setDirectory, loading, numFiles }) => {
    const { classes } = useDirectoryStyles()

    return (<SettingsContainer>
        <Button color="dark" leftIcon={<MdRefresh size='1.25em'/>} size='sm' compact
            variant='subtle'
            sx={(theme) => ({
                position: 'absolute',
                right: 0,
                bottom: 0,
                '&:hover': {
                    backgroundColor: theme.colors.bg2[0]
                }
            })}
            onClick={() => reloadFiles()}
        >
            Reload
        </Button>

        <Center sx={{height: '100%'}}>
            <Grid>
                <Grid.Col span={4}>
                    <Center>
                        <DirectorySetter 
                            title='Source Files'
                            path={srcDir}
                            onClick={() => setDirectory('src')}
                        >
                            <Space h='xs' />

                            <Text size='xs' weight="bold" align="center">
                                {!loading ? `Found ${numFiles ?? 0} file(s)` : `Loading...`}
                            </Text>
                        </DirectorySetter>
                    </Center>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Center sx={{height: '100%'}}>
                        <ImArrowRight 
                            size={'5em'}
                            className={classes.dir_icons}
                        />
                    </Center>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Center>
                        <DirectorySetter 
                            title='Chop Directory'
                            path={chopDir}
                            onClick={() => setDirectory('chop')}
                        />
                    </Center>
                </Grid.Col>
            </Grid>
        </Center>
    </SettingsContainer>)
}