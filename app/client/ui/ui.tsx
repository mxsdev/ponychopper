import React from "react";
import { MantineProvider, ActionIconProps } from "@mantine/core"
import { COL_PRIMARY } from "./colors";
import { Tuple } from "util/types/tuple";

const bg = 'rgba(1, 1, 1, 0.1)'
const bg2 = 'rgba(1, 1, 1, 0.05)'

export const wrapUIProvider = (node: React.ReactNode) => (
    <MantineProvider
        theme={{
            colors: {
                'primary': COL_PRIMARY,
                'bg': (new Array<string>(10).fill(bg) as Tuple<string, 10>),
                'bg2': (new Array<string>(10).fill(bg2) as Tuple<string, 10>),
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
            }),
            Tabs: (theme) => ({
                default: {
                    borderColor: theme.colors['bg'][0]
                }
            }),
            Input: (theme) => ({
                filled: {
                    display: 'none !important'
                }
            }),
        }}

        defaultProps={{
            ActionIcon: {
                color: 'primary'
            },
            Divider: {
                color: 'dark',
                styles: (theme: any) => ({
                    label: {
                        color: `${theme.colors.dark[6]} !important`,
                        fontWeight: 'bold'
                    }
                })
            },
            Input: {
                variant: 'filled',
                styles: (theme: any) => ({
                    input: {
                        backgroundColor: `${theme.colors.bg2[0]} !important`,
                        '::placeholder': {
                            color: theme.colors.dark[3]
                        }
                    }
                })
            },
            Select: {
                styles: (theme: any) => ({
                    input: {
                        backgroundColor: `${theme.colors.bg2[0]} !important`,
                        '::placeholder': {
                            color: theme.colors.dark[3]
                        }
                    },
                    // dropdown: {
                    //     backgroundColor: `${theme.colors.bg2[0]}`
                    // }

                })
            }
        }}
    >
        {node}
    </MantineProvider>
)