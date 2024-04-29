import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      Window: {
        Minimize: () => void,
        MinMax: () => void,
        Close: () => void
      }
      Action: {
        LoadImage: (state: number, previusState: null | string) => string,
        CreateModel: (Name: string, Avatars: [null | string, null | string]) => void
      }
    }
  }
}
