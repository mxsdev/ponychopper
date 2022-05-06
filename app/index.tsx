import './css/main.css'
import Main from './client/main'
import React, { ReactNode } from 'react'
import { createRoot } from 'react-dom/client';
import { type WindowType } from 'electron/main/windows';
import { Settings } from 'client/settings';

const params = new URLSearchParams(window.location.search)

const mode: WindowType = params.get('settings') === 'true' ? 'settings' : 'main'

const container = document.getElementById('root')
const root = createRoot(container!)

switch (mode) {
    case 'main':
        root.render(<Main />)
        break
    case 'settings':
        root.render(<Settings />)
        break
}