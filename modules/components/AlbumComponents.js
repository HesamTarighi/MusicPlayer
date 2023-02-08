const {JsonEditor} = require('../global/JsonEditor')
const {App} = require('../global/App')

class AlbumComponents {
    static editAlbumData (id, props) {
        JsonEditor.get(__ALBUMS_DB_PATH, albums_data => {
            const index = albums_data.findIndex(album => album.id == id)
            
            JsonEditor.edit(__ALBUMS_DB_PATH, index, props)
                .then(data => {
                    __WIN.webContents.send('ALBUMS', data)
                    App.restart()
                })
        })
    }
    static addAlbumData (name, picture, audios) {
        JsonEditor.get(__ALBUMS_DB_PATH, data => {
            JsonEditor.append(
                __ALBUMS_DB_PATH,
                {id: data.length, name: name, picture: picture, paths: audios}
            ).then(() => App.restart())
        })
    }
    static checkAlbums (data, callback) {
        if (data != '') callback(1)
        else callback(0)
    }
}

module.exports = {AlbumComponents}
