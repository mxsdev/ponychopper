import React from "react";
import { MantineProvider, ActionIconProps } from "@mantine/core"
import { COL_PRIMARY } from "./colors";
import { Tuple } from "util/types/tuple";

export const wrapUIProvider = (node: React.ReactNode) => (
    <MantineProvider
        theme={{
            colors: {
                'primary': COL_PRIMARY,
                'bg': (new Array<string>(10).fill('rgba(1, 1, 1, 0.1)') as Tuple<string, 10>)
            },
            primaryColor: 'primary',
            primaryShade: 5,
        }}

        styles={{
            ActionIcon: (theme, params: ActionIconProps<any>) => ({
                hover: {
                    '&:hover': {
                        backgroundColor: 'rgba(1, 1, 1, 0.1)',
                    },
                    // color: theme.colors[params.color ?? 'primary'][7]
                }
            }),
            Button: (theme) => ({
                filled: {
                    boxShadow: theme.shadows['sm']
                }
            })
        }}

        defaultProps={{
            ActionIcon: {
                color: 'primary'
            }
        }}
    >
        {node}
    </MantineProvider>
)