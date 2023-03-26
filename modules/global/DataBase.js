const { JsonEditor } = require('./JsonEditor')

function clearDatabase (database_name) {
    return new Promise((resolve, reject) => {
        switch (database_name) {
            case 'audios':
                JsonEditor.write(__ALBUM_DB_PATH, [])
                resolve(`The ${database_name} was cleared.`)
                break;
            
            case 'albums':
                JsonEditor.write(__ALBUMS_DB_PATH, [])
                resolve(`The ${database_name} was cleared.`)
                break;
    
            default:
                reject('This is database not found!')
                break;
        }
    })
}

module.exports = {clearDatabase}
