const {app} = require('electron')

class App {
    static restart () {
        app.relaunch()
        app.exit()
    }
}

module.exports = {App}
