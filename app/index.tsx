import './css/main.css'
import Main from './main'
import React, { ReactNode } from 'react'
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(<Main />)