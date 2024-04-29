import { app, shell, BrowserWindow, ipcMain, dialog, Notification } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ImageBase64 } from './utils'
import { writeFile } from 'fs'
import { userInfo } from 'os'

let mainWindow: BrowserWindow

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    maxWidth: 900,
    maxHeight: 670,
    show: false,
    autoHideMenuBar: true,
    maximizable: false,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: is.dev && process.env['ELECTRON_RENDERER_URL'] ? true : false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on("LoadImage", (_event, { state, previusState }) => {
    const FilePath = dialog.showOpenDialogSync(mainWindow, {
      title: `Selecciona el estado: ${state}`,
      buttonLabel: "Cargar",
      properties: ["openFile"],
      filters: [{
        extensions: ["png"],
        name: "Imagen"
      }]
    })

    if (FilePath) _event.returnValue = ImageBase64(FilePath[0])
    else _event.returnValue = previusState
  })

  ipcMain.on("CreateModel", (_event, { Name, Avatars }) => {
    if (Name.length === 0) _event.returnValue = false
    if (Avatars[0] === null) _event.returnValue = false
    if (Avatars[1] === null) _event.returnValue = false

    const FilePath = dialog.showSaveDialogSync(mainWindow, {
      title: "Guardar modelo como",
      buttonLabel: "Guardar Modelo",
      filters: [{
        extensions: ["json"],
        name: "JSON"
      }]
    })

    if (FilePath) {
      writeFile(FilePath, JSON.stringify({
        Name,
        Owner: userInfo().username,
        Date: new Date(),
        Image: Avatars[0],
        Data: {
          States: [
            [
              Avatars[0],
              Avatars[1]
            ]
          ]
        },
        URL: ""
      }), { encoding: 'utf-8' }, err => {
        if (err) {
          new Notification({
            title: "🔴 PngtubeMini Model Generator",
            body: "Hubo un problema con la creacion del modelo"
          }).show()
        }
        else {
          new Notification({
            title: "🟢 PngtubeMini Model Generator",
            body: "El modelo se creo correctamente"
          }).show()
        }
      })

    } else new Notification({
      title: "🟡 PngtubeMini Model Generator",
      body: "La operacion ha sido cancelada"
    }).show()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})