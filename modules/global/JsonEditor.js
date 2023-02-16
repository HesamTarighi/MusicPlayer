const fs = require('fs')

class JsonEditor {
    static append (path, data, index) {
        const reading = fs.createReadStream(path)
    
        reading.on('data', json_data => {
            json_data = JSON.parse(json_data.toString())
    
            json_data.length > 0 && index ? json_data[index].push(data) : json_data.push(data)
    
            fs.writeFile(path, JSON.stringify(json_data), err => console.log(err))
        })
        return Promise.resolve('')
    }
    static edit (path, index, props) {
        return new Promise((resolve, reject) => {
            const reading = fs.createReadStream(path)

            reading.on('data', json_data => {
                const data = JSON.parse(json_data.toString())

                const props_keys = Object.keys(props)
                const props_values = Object.values(props)

                for (let i = 0; i < props_keys.length; i++) data[index][props_keys[i]] = props_values[i]

                reading.on('end', () => {
                    this.write(path, data)
                })
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
