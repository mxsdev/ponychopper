import './css/main.css'
import Main from './client/main'
import React, { ReactNode } from 'react'
import { createRoot } from 'react-dom/client';
import { type WindowType } from 'electron/main/windows';
import { Settings } from 'client/settings';
import { wrapUIProvider } from 'client/ui/ui';

const params = new URLSearchParams(window.location.search)

const mode: WindowType = params.get('settings') === 'true' ? 'settings' : 'main'

const container = document.getElementById('root')
const root = createRoot(container!)

const main = (() => {
    switch (mode) {
        case 'main':
            return (<Main />)
        case 'settings':
            return (<Settings />)
    }
})()

root.render(
    <React.StrictMode>
        {wrapUIProvider(main)}
    </React.StrictMode>
)