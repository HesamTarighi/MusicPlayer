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
                json_data = JSON.parse(json_data.toString())

                const newData = { ...json_data, ...props }

                reading.on('end', () => {
                    fs.writeFile(path, JSON.stringify(newData), err => resolve(newData))
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
            
                fs.writeFile(path, JSON.stringify(json_data), err => resolve(json_data))
            })
        })
    }
    static write (path, data, callback) {
        try {
            fs.writeFile(path, JSON.stringify(data), err => callback ? callback(err) : '')
        } catch (err) {
            return err;
        }
    }
    static get (path, callback) {
        fs.readFile(path, (err, json_data) => {
            console.log(err)
            if (!err) callback(JSON.parse(json_data.toString()))
            else callback(err)
        })
    }
}

module.exports = {
    JsonEditor
}
