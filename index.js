require('./GlobalVariables')
require('electron-reload')(__dirname, {electron: require(`${__dirname}/node_modules/electron`)})
const { BrowserWindow, app, ipcMain } = require('electron')
const { Album } = require('./modules/Album')
const { App } = require('./modules/global/App')
const { JsonEditor } = require('./modules/global/JsonEditor')
const { clearDatabase } = require('./modules/global/DataBase')
const Event = require('./modules/global/Event')

// Global IPC Events
    // RELAUNCH_APP
    ipcMain.on('RESTART_APP', (e) => App.restart())
    // CLEAR_DATABASE
    ipcMain.on('CLEAR_DATABASE', (e, database_name) => clearDatabase(database_name))
    // CHANGE_STEP
    ipcMain.on('CHANGE_STEP', (e, step) => __WIN.webContents.send('STEP', step))

function createWindow (file_path) {
    __WIN = new BrowserWindow({
        width: 900,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            preload: __dirname + '/src/scripts/preload.js'
        }
    })
    
    __WIN.loadFile(file_path)
}

function main () {
    JsonEditor.get(__ALBUMS_DB_PATH, data => {
        Event.sendEvent('ALBUMS', data)
        Event.sendEvent('STEP', 2)
    })
    Event.sendEvent('UPLOAD')
    Album.addNewAlbum()
    Album.editAlbum()
    Album.selectAlbum()
    Album.removeAlbum()

}

app.on('ready', async () => {
    await createWindow('./src/index.html')
    main()
})
