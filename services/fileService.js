const fs = require('fs')
const fsPromises = fs.promises;
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
    
    deleteFile(req, file) {
        const path = this.getPath(req, file)
        if (file.type === 'dir') {
            fs.rmdirSync(path)
        } else {
            fs.unlinkSync(path)
        }
    }

    getPath(req, file) {
            return path.join(req.filePath, 'users', String(file.user), file.path)         
        }
    
    async getExtendFiles(filesPath) {
        let files =[]
        if (fs.existsSync(filesPath)) {
            const fileList = await fsPromises.readdir(filesPath)
            files = await Promise.all(fileList.map(async file => {
                const statFile = await fsPromises.stat(path.join(filesPath, file))
                return { name: file, time: statFile.mtime, size: statFile.size }
            }))
            
        }
        return files
    }
}


module.exports = new FileService()
