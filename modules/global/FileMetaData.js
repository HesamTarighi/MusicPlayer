const jsmedia = require('jsmediatags')

function getFileMetaData (paths, callback) {
    var data = []

    for (let i = 0; i < paths.length; i++) {
        jsmedia.read(paths[i], {
            onSuccess: tag => {
                const undefined_picture = 'https://picsum.photos/seed/picsum/800/?grayscale'
                const info = {
                    title: tag.tags.title,
                    artist: tag.tags.artist,
                    picture: tag.tags.picture ? 'data:image/jpeg;base64,' + Buffer.from(tag.tags.picture.data).toString('base64') : undefined_picture,
                    file_name: paths[i].split('\\')[paths[i].split('\\').length -1],
                    path: paths[i]
                }

                data.push(info)
                if (i == paths.length -1) callback(data)
            }
        })
    }
}

module.exports = {getFileMetaData}
