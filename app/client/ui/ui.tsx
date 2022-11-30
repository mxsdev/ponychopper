import React from "react";
import { MantineProvider, ActionIconProps } from "@mantine/core"
import { COL_PRIMARY } from "./colors";
import { Tuple } from "util/types/tuple";

const bg = 'rgba(1, 1, 1, 0.1)'
const bg2 = 'rgba(1, 1, 1, 0.05)'

const SelectStyles = {
    styles: (theme: any) => ({
        input: {
            backgroundColor: `${theme.colors.bg2[0]} !important`,
            '::placeholder': {
                color: theme.colors.dark[3]
            }
        }
    })
}

const SliderStyles = {
    styles: (theme: any) => ({
        track: {
            '::before': {
                backgroundColor: `${theme.colors.bg[0]}`,
                boxShadow: theme.shadows.md
            }
        },
        mark: {
            border: 'none',
            backgroundClip: 'content-box',
            padding: '1px',
        },
        markFilled: {
            padding: '2px',
        }
    })
}

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
                }
            }),
            Button: (theme) => ({
                filled: {
                    boxShadow: theme.shadows['sm']
                },
                subtle: {
                    '&:hover': {
                        backgroundColor: 'rgba(1, 1, 1, 0.05)',
                    },
                },
                outline: {
                    '&:hover': {
                        backgroundColor: 'rgba(1, 1, 1, 0.05)',
                    },
                },
                light: {
                    backgroundColor: 'rgba(1, 1, 1, 0.05)',
                    '&:hover': {
                        backgroundColor: 'rgba(1, 1, 1, 0.075)',
                    },
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
            Select: SelectStyles,
            NativeSelect: SelectStyles,
            Chips: {
                styles: (theme: any) => ({ 
                    label: { 
                        background: `${theme.colors.bg2[0]} !important`,
                        ':not(input:checked+&)': {
                            borderColor: `rgba(1, 1, 1, 0)`
                        }
                    },
                    
                })
            },
            Switch: {
                styles: (theme: any) => ({
                    input: {
                        backgroundColor: `${theme.colors.bg[0]}`,
                        ':hover': {
                            cursor: 'pointer'
                        },
                        borderColor: 'rgba(0, 0, 0, 0)'
                    }
                })
            },
            Slider: SliderStyles,
            RangeSlider: SliderStyles
        }}
    >
        {node}
    </MantineProvider>
)