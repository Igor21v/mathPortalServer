const User = require("../models/User")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")
const fileService = require('../services/fileService')
const File = require('../models/File')
const path = require('path')
const fs = require('fs')
const { getExtendUser } = require("../services/userService")
const fsPromises = fs.promises;
/* const { promisify } = require('util')
const fsExistsAsync = promisify(fs.exists) */


class userController {

    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Ошибка регистрации: " + errors.array()[0].msg })
            }
            const { phon, password, name, surname } = req.body
            const candidate = await User.findOne({ phon })
            if (candidate) {
                return res.status(400).json({ message: `Пользователь с номером телефона +7${phon} уже существует` })
            }
            const hashPassword = await bcrypt.hash(password, 8)
            const user = new User({ phon, password: hashPassword, name, surname })
            await user.save()
            await fileService.createDir(req, new File({ user: user.id, name: '' }))
            const userList = await User.find({ role: "STUDENT" }, { password: 0 })
            return res.json(userList)
        } catch (e) {
            console.log(e)
            res.send({ message: "Server error" })
        }
    }

    async getUserList(req, res) {
        try {
            const userList = await User.find({ role: "STUDENT" }, { password: 0 }).sort({surname: 1})
            return res.json(userList)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message: "Can not get users" })
        }
    }
    async editUser(req, res) {
        try {
            const user = await User.findById(req.body.id)
            for (let key in req.body) {
                user[key] = req.body[key]
            }
            await user.save()
            const userList = await User.find({ role: "STUDENT" }, { password: 0 })
            return res.json(userList)
        }
        catch (e) {
            return res.status(500).json({ message: "Can not save user change" })
        }
    }
    async deleteUser(req, res) {
        try {
            const id = req.query.id
            console.log('id ' + JSON.stringify(req.query))
            const user = await User.findById(id)
            const filePath = path.join(req.filePath, 'users', id)
            await user.remove()
            if (fs.existsSync(filePath)) {
                await fsPromises.rm(filePath, { recursive: true })
            }
            const userList = await User.find({ role: "STUDENT" }, { password: 0 })
            return res.json(userList)
        }
        catch (e) {
            console.log('Ошибка при удал пользователя')
            console.log(e)
            return res.status(500).json({ message: 'Ошибка при удалении пользователя' })
        }
    }

    async changePassword(req, res) {
        try {
            const user = await User.findById(req.body.id)
            user.password = req.body.password
            await user.save()
            return res.json('Изменение пароля прошло успешно')
        }
        catch (e) {
            console.log(e)
            return res.status(500).json({ message: 'Ошибка при изменении пароля' })
        }
    }

    async getUserExtend(req, res) {
        try {
            const user = await getExtendUser(req.filePath, req.query.id, req.query.folder)
            return res.json(user)
        }
        catch (e) {
            console.log('Error get ' + e)
            return res.status(500).json({ message: "Can not get extend user" })
        }
    }
}

module.exports = new userController()
