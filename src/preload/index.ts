import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  Action: {
    LoadImage: (state: number, previusState: null | string) => ipcRenderer.sendSync("LoadImage", { state, previusState }),
    CreateModel: (Name: string, Avatars: [null | string, null | string]) => ipcRenderer.send("CreateModel", { Name, Avatars })
  },
  Window: {
    Minimize: () => ipcRenderer.send("minimize"),
    MinMax: () => ipcRenderer.send("restore"),
    Close: () => ipcRenderer.send("close")
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
