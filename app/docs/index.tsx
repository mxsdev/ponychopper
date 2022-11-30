import 'css/main.css'
import React, { ReactNode } from 'react'
import { createRoot } from 'react-dom/client';
import { wrapUIProvider } from 'client/ui/ui';
import { FancyHeader } from 'client/component/header/FancyHeader';
import { MdBook, MdDownload } from "react-icons/md"
import { Box, Button, Space, Group, Anchor } from '@mantine/core';
import { PROJECT_DOCS, PROJECT_RELEASES } from 'util/url';

const container = document.getElementById('root')
const root = createRoot(container!)

const Docs = () => (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "Center"
            }}
        >
            <FancyHeader />
            <Space h='xl' />

            <Group spacing="xs">
                <Anchor href={PROJECT_DOCS}>
                    <Button leftIcon={<MdBook size={18}/>} variant="light">
                        Docs
                    </Button>
                </Anchor>
                <Anchor href={PROJECT_RELEASES}>
                    <Button leftIcon={<MdDownload size={18}/>} variant="light">
                        Download
                    </Button>
                </Anchor>
            </Group>

        </Box>
)

root.render(
    <React.StrictMode>
        {wrapUIProvider(<Docs/>)}
    </React.StrictMode>
)
