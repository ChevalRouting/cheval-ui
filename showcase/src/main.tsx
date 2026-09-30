import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@chevalrouting/cheval-ui'
import App from './App'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><ThemeProvider storageKey="cheval-ui-workbench-theme" defaultTheme="dark"><App /></ThemeProvider></BrowserRouter></React.StrictMode>)
