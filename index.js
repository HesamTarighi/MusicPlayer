const {BrowserWindow, app, dialog, ipcMain} = require('electron')
require('electron-reload')(__dirname, {electron: require(`${__dirname}/node_modules/electron`)})
const fs = require('fs')
const jsmedia = require('jsmediatags')
const audio_db_path = './src/db/audios.json'
const audio_paths = require(audio_db_path)

const callRendererEvents = (event_name, payload) => ipcMain.on('CALL_RENDERER_EVENT', e => e.sender.send(event_name, payload))
function createWindow(file_path) {
    const win = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            preload: __dirname + '/src/main.js'
        }
    })
    
    win.loadFile(file_path)
}
ipcMain.on('UPLOADING', e => {
    dialog.showOpenDialog({
        title: 'Select the audio',
        defaultPath: 'C:\\',
        buttonLabel: 'Upload',
        filters: [
            {
                name: 'mp3 Files',
                extensions: ['mp3']
            },
        ],
        properties: ['openFile', 'multiSelections']
    })
    .then(file => {
        if (!file.canceled) {
            // for (const file_path of file.filePaths) {
                    // fs.readFile(file_path, (err, data) => {
                    //     fs.writeFile(`${path + (10000 + Math.floor(Math.random()*99999))}.mp3`, data, err => {
                    //         checkAlbum(static_path ,(status, files) => {
                    //             if (files.length == file.filePaths.length) {
                    //                 app.relaunch()
                    //                 app.exit()
                    //                 callRendererEvents('ALBUM_STATUS', status)
                    //                 getFileMetaData(static_path ,data => callRendererEvents('RENDER_MUSIC_PLAYER', data))
                    //             }
                    //         })
                    //     })
                    // })
            // }

            fs.writeFile(audio_db_path, JSON.stringify(file.filePaths), err => console.log(err))
            app.relaunch()
            app.exit()
        }
    })
})
function checkAudioPaths(path, callback) {
    if (audio_paths != '') callback(1)
    else callback(0)
}
function getFileMetaData(path, callback) {
    var data = []

    for (let i = 0; i < path.length; i++) {
        jsmedia.read(path[i], {
            onSuccess: tag => {
                const info = {
                    title: tag.tags.title,
                    artist: tag.tags.artist,
                    picture: tag.tags.picture,
                    file_name: path[i].split('\\')[path[i].split('\\').length -1],
                    path: path[i]
                }
                data.push(info)
                if (i == path.length -1) callback(data)
            }
        })
    }
}

if (require('electron-squirrel-startup')) return app.quit()

app.on('ready', () => {
    createWindow('./src/index.html')
    checkAudioPaths(audio_db_path, status => {
        callRendererEvents('ALBUM_STATUS', status)
    })
    getFileMetaData(audio_paths, data => callRendererEvents('RENDER_MUSIC_PLAYER', data))
    callRendererEvents('UPLOAD')
})

app.on('before-quit', async () => {
    await fs.writeFile(audio_db_path, '[]', err => console.log(err))
})
