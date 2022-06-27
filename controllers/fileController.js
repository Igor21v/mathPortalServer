const fileService = require('../services/fileService')
const config = require('config')
const fs = require('fs')
const fsPromises = fs.promises
const User = require('../models/User')
const File = require('../models/File')
const Uuid = require('uuid')
const path = require('path')
const { getExtendUser } = require('../services/userService')


class FileController {

    async change(req, res) {
        try {
            const file = path.resolve('static', req.body.name)
            console.log('start write ')
            await new Promise((resolve, reject) => {
                fs.writeFileSync(file, req.body.data)
                resolve()
            })
            return res.json('Write OK: ' + req.body.name)
        } catch (err) {
            console.log(err)
            return res.status(400).json(err)
        }
    }

    async read(req, res) {
        try {
            const file = path.resolve('static', req.body.name)
            console.log('start read ' + req.body.name + 'path: ' + file)
            let data = await new Promise((resolve, reject) => {
                let data = fs.readFileSync(file)
                resolve(data)
            });

            return res.json('Read OK: ' + data)
        } catch (err) {
            console.log(err)
            return res.status(400).json(err)
        }
    }

    async createDir(req, res) {
        try {
            const { name, type, parent } = req.body
            const file = new File({ name, type, parent, user: req.user.id })
            const parentFile = await File.findOne({ _id: parent })
            if (!parentFile) {
                file.path = name
                await fileService.createDir(req, file)
            } else {
                file.path = `${parentFile.path}\\${file.name}`
                await fileService.createDir(req, file)
                parentFile.childs.push(file._id)
                await parentFile.save()
            }
            await file.save()
            return res.json(file)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async getFiles(req, res) {
        try {
            const { sort } = req.query
            let files
            switch (sort) {
                case 'name':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ name: 1 })
                    break
                case 'type':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ type: 1 })
                    break
                case 'date':
                    files = await File.find({ user: req.user.id, parent: req.query.parent }).sort({ date: 1 })
                    break
                default:
                    files = await File.find({ user: req.user.id, parent: req.query.parent })
                    break;
            }
            return res.json(files)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not get files" })
        }
    }

    async uploadFile(req, res) {
        try {
            const file = req.files.file

            const parent = await File.findOne({ user: req.user.id, _id: req.body.parent })
            const user = await User.findOne({ _id: req.user.id })

            if (user.usedSpace + file.size > user.diskSpace) {
                return res.status(400).json({ message: 'There no space on the disk' })
            }

            user.usedSpace = user.usedSpace + file.size

            let path;
            if (parent) {
                path = `${req.filePath}\\users\\${user._id}\\${parent.path}\\${file.name}`
            } else {
                path = `${req.filePath}\\users\\${user._id}\\${file.name}`
            }

            if (fs.existsSync(path)) {
                return res.status(400).json({ message: 'File already exist' })
            }
            file.mv(path)

            const type = file.name.split('.').pop()
            let filePath = file.name
            if (parent) {
                filePath = parent.path + "\\" + file.name
            }
            const dbFile = new File({
                name: file.name,
                type,
                size: file.size,
                path: filePath,
                parent: parent ? parent._id : null,
                user: user._id
            })

            await dbFile.save()
            await user.save()

            res.json(dbFile)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Upload error" })
        }
    }

    async downloadFile(req, res) {
        try {
            const file = await File.findOne({ _id: req.query.id, user: req.user.id })
            const path = fileService.getPath(req, file)
            if (fs.existsSync(path)) {
                return res.download(path, file.name)
            }
            return res.status(400).json({ message: "Download error" })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Download error" })
        }
    }
    async deleteFile(req, res) {
        try {
            const file = await File.findOne({ _id: req.query.id, user: req.user.id })
            if (!file) {
                return res.status(400).json({ message: 'file not found' })
            }
            fileService.deleteFile(req, file)
            await file.remove()
            return res.json({ message: 'File was deleted' })
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Dir is not empty' })
        }
    }

    async searchFile(req, res) {
        try {
            const searchName = req.query.search
            let files = await File.find({ user: req.user.id })
            files = files.filter(file => file.name.includes(searchName))
            return res.json(files)
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Search error' })
        }
    }

    async uploadAvatar(req, res) {
        try {
            const file = req.files.file
            const user = await User.findById(req.user.id)
            const avatarName = Uuid.v4() + ".jpg"
            file.mv(path.resolve('static', avatarName))
            user.avatar = avatarName
            await user.save()
            return res.json(user)
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Upload avatar error' })
        }
    }

    async deleteAvatar(req, res) {
        try {
            const user = await User.findById(req.user.id)
            fs.unlinkSync(path.resolve('static', user.avatar))
            user.avatar = null
            await user.save()
            return res.json(user)
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: 'Delete avatar error' })
        }
    }

    async downloadUserFile(req, res) {
        try {
            console.log('Download start' + req.query.userId + ' ' + req.query.file + ' ' + req.filePath)
            const filePath = path.join(req.filePath, 'users', req.query.userId, req.query.folder, req.query.file);
            if (fs.existsSync(filePath)) {
                return res.download(filePath)
            }
            console.log('File not found' + filePath)
            return res.status(400).json({ message: "Download error, file not found" })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Download error" })
        }
    }

    async postUserFile(req, res) {
        try {
            const file = req.files.file
            const filePath = path.join(req.filePath, 'users', req.body.userId, req.body.folder, file.name);
            const folderPath = path.join(req.filePath, 'users', req.body.userId, req.body.folder)
            if (fs.existsSync(folderPath)) {
                if (fs.existsSync(filePath)) {
                    return res.status(400).json({ message: 'Файл "' + file.name + '" уже существует' })
                }
            } else {
                await fsPromises.mkdir(folderPath)
            }
            await file.mv(filePath)
            const user = await getExtendUser(req.filePath, req.body.userId, req.body.folder)
            return res.json(user)
        } catch (e) {
            console.log('Ошибка' + e)
            return res.status(500).json({ message: "Ошбка на сервере" })
        }
    }

    async deleteUserFile(req, res) {
        try {
            console.log('startDelete')
            const filePath = path.join(req.filePath, 'users', req.query.userId, req.query.folder, req.query.fileName);
            await fsPromises.unlink(filePath)
            const user = await getExtendUser(req.filePath, req.query.userId, req.query.folder)
            return res.json(user)
        } catch (e) {
            console.log('Ошибка' + e)
            return res.status(500).json({ message: "Ошбка на сервере" })
        }
    }

}

module.exports = new FileController()
