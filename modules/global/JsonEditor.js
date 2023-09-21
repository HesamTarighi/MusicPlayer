const fs = require('fs')

class JsonEditor {
    static append (path, data, index) {
        return new Promise((resolve, reject) => {
            const reading = fs.createReadStream(path)

            reading.on('data', json_data => {
                json_data = JSON.parse(json_data.toString())

                json_data.length > 0 && index ? json_data[index].push(data) : json_data.push(data)

                reading.on('end', () => this.write(path, json_data))
            })
        })
    }
    static edit (path, index, props) {
        return new Promise((resolve, reject) => {
            const reading = fs.createReadStream(path)

            reading.on('data', json_data => {
                json_data = JSON.parse(json_data.toString())

                json_data[index] = { ...json_data[index], ...props }

                reading.on('end', () => fs.writeFile(path, JSON.stringify(json_data), err => resolve(json_data)))
            })
        })
    }
    static removeItem (path, index) {
        return new Promise((resolve, reject) => {
            const reading = fs.createReadStream(path)
            
            reading.on('data', json_data => {
                json_data = JSON.parse(json_data.toString())
                
                json_data.splice(index, 1)
            
                fs.writeFile(path, JSON.stringify(json_data), err => {
                    if (!err) resolve(json_data)
                    else reject(err)
                })
            })
        })
    }
    static write (path, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, JSON.stringify(data), err => {
                if (!err) resolve(data)
                else reject(err)
            })
        })
    }
    static get (path, callback) {
        fs.readFile(path, (err, json_data) => {
            if (!err) callback(JSON.parse(json_data.toString()))
            else callback(err)
        })
    }
}

module.exports = {
    JsonEditor
}
