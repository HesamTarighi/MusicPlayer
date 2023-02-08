const {dialog} = require('electron')
const {homedir} = require('os')

const default_options = {
    title: 'Select files',
    path: homedir() + '/Desktop',
    button_label: 'Upload',
    filters: [
        {
            name: 'All files',
            extensions: ['*']
        }
    ],
    properties: ['openFile', 'multiSelections']
}

function uploader (callback, options) {
    dialog.showOpenDialog({
        title: options && options.title || default_options.title,
        defaultPath: options && options.path || default_options.path,
        buttonLabel: options && options.button_label || default_options.button_label,
        filters: options && options.filters || default_options.filters,
        properties: options && options.properties || default_options.properties
    })
    .then(file => {
        if (!file.canceled) callback(file.filePaths)
    })
}

module.exports = {uploader}
