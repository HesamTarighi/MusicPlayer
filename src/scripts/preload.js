const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, payload) => ipcRenderer.send(channel, payload),
    on: (channel, cb) => ipcRenderer.on(channel, cb)
})
