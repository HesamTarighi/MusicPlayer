function sendEvent (event_name, payload) {
    __WIN.webContents.on('did-finish-load', () => {
        __WIN.webContents.send(event_name, payload)
    })
}

module.exports = { sendEvent }
