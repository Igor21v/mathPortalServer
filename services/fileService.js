const fs = require('fs')
const { join } = require('path')
const path = require('path')

class FileService {

    createDir(req, file) {
        const filePath = this.getPath(req, file)
        return new Promise(((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({message: 'File was created'})
                } else {
                    return reject({message: "File already exist"})
                }
            } catch (e) {
                return reject({message: 'File error'})
            }
        }))
    }  
    readDir(req, file) {
        const filePath = this.getPath(req, file)
            try {
                const files = fs.readdirSync(filePath)
              return files
            } catch (e) {
                return reject({message: 'Dir error'})
            }
        }
      
    deleteFile(req, file) {
        const path = this.getPath(req, file)
        if (file.type === 'dir') {
            fs.rmdirSync(path)
        } else {
            fs.unlinkSync(path)
        }
    }

    getPath(req, file) {
        if (file.user) {
            console.log(String(file.user))
            return path.join(req.filePath, 'users', String(file.user), file.path)         
        }
        if (file.theme) {
            return path.join(req.filePath, 'themes', file.theme)
        }
    }
}


module.exports = new FileService()
