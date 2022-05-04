import { contextBridge, ipcRenderer } from 'electron'
import api from './api/api'

contextBridge.exposeInMainWorld('api', api)