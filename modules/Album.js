const {ipcMain, ipcRenderer} = require('electron')
const {AlbumComponents} = require('./components/AlbumComponents')
const {JsonEditor} = require('./global/JsonEditor')
const {App} = require('./global/App')
const {uploader} = require('./global/Uploader')
const {getFileMetaData} = require('./global/FileMetaData')

class Album extends AlbumComponents {
    static addAlbum () {
        let album_name = ''
        let album_picture = ''
        let album_audios = []

        const audios_options = {
            title: 'Select Audios',
            
            filters: [
                {
                    name: 'Audios',
                    extensions: __AUDIO_EXTENSIONS
                }
            ]
        }
        const picture_options = {
            title: 'Select picture',
            
            filters: [
                {
                    name: 'Pictures',
                    extensions: __IMAGE_EXTENSIONS
                }
            ],
    
            properties: ['openFile']
        }
    
        // ADD_ALBUM_NAME
        ipcMain.on('ADD_ALBUM_NAME', (e, name) => album_name = name)
        // ADD_ALBUM_COVER
        ipcMain.on('ADD_ALBUM_PICTURE', () => uploader(file_paths => album_picture = file_paths[0], picture_options))
        // ADD_ALBUM_AUDIOS
        ipcMain.on('ADD_ALBUM_AUDIOS', () => uploader(file_paths => album_audios = file_paths, audios_options))
        // SUBMIT_ADD_ALBUM
        ipcMain.on('SUBMIT_ADD_ALBUM', () => this.addAlbumData(album_name, album_picture, album_audios))
    }
    static editAlbum () {
        const audios_options = {
            title: 'Select Audios',
            
            filters: [
                {
                    name: 'Audios',
                    extensions: __AUDIO_EXTENSIONS
                }
            ]
        }
        const picture_options = {
            title: 'Select picture',
            
            filters: [
                {
                    name: 'Pictures',
                    extensions: __IMAGE_EXTENSIONS
                }
            ],
    
            properties: ['openFile']
        }

        // EDIT ALBUM NAME
        ipcMain.on('EDIT_ALBUM_NAME', (e, {id, props}) => ipcMain.on('SUBMIT_ALBUM_EDITED', () => this.editAlbumData(id, props)))
        // EDIT ALBUM PICTURE
        ipcMain.on('EDIT_ALBUM_PICTURE', (e, id) => uploader(file_paths => editAlbumData(id, {picture: file_paths[0]}), picture_options))
        // EDIT ALBUM AUDIOS
        ipcMain.on('EDIT_ALBUM_AUDIOS', (e, id) => uploader(file_paths => this.editAlbumData(id, {paths: file_paths}), audios_options))
    }
    static selectAlbum () {
        // SELECT ALBUM
        ipcMain.on('SELECT_ALBUM', (e, album_data) => {
            JsonEditor.write(__ALBUM_DB_PATH, album_data, () => {
                JsonEditor.get(__ALBUM_DB_PATH, data => {
                    __WIN.webContents.send('STEP', 3)
                    getFileMetaData(data.paths, meta_data => __WIN.webContents.send('RENDER_MUSIC_PLAYER', meta_data))                })
            })
        })
    }
    static removeAlbum () {
        // REMOVE ALBUM
        ipcMain.on('REMOVE_ALBUM', (e, id) => {
            JsonEditor.get(__ALBUMS_DB_PATH, albums_data => {
                const index = albums_data.findIndex(album => album.id == id)
                
                JsonEditor.removeItem(__ALBUMS_DB_PATH, index)
                .then(data => {
                    __WIN.webContents.send('ALBUMS', data)
                    App.restart()
                })
            })
        })
    }
}

module.exports = {Album}
