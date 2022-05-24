const User = require("../models/User")
const bcrypt = require("bcryptjs")
const config = require("config")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const fileService = require('../services/fileService')
const File = require('../models/File')

class authController {

    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Ошибка регистрации: " + errors.array()[0].msg })
            }
            const { phon, password, name, surname } = req.body
            const candidate = await User.findOne({ phon })
            if (candidate) {
                return res.status(400).json({ message: `User with phon ${phon} already exist` })
            }
            const hashPassword = await bcrypt.hash(password, 8)
            const user = new User({ phon, password: hashPassword, name, surname })
            await user.save()
            await fileService.createDir(req, new File({ user: user.id, name: '' }))
            res.json({ message: "User was created" })
        } catch (e) {
            console.log(e)
            res.send({ message: "Server error" })
        }
    }

    async login(req, res) {
        try {
            const { phon, password } = req.body
            const user = await User.findOne({ phon })
            if (!user) {
                return res.status(404).json({ message: "User not found" })
            }
            const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid) {
                return res.status(400).json({ message: "Invalid password" })
            }
            const token = jwt.sign({ id: user.id, role: user.role }, config.get("secretKey"), { expiresIn: "72h" })
            return res.json({
                token,
                user: {
                    id: user.id,
                    phon: user.phon,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar,
                    role: user.role
                }
            })
        } catch (e) {
            console.log(e)
            res.send({ message: "Server error" })
        }
    }
    async auth(req, res) {
        try {
            const user = await User.findOne({ _id: req.user.id })
            const token = jwt.sign({ id: user.id, role: user.role }, config.get("secretKey"), { expiresIn: "24h" })
            return res.json({
                token,
                user: {
                    id: user.id,
                    phon: user.phon,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar,
                    role: user.role
                }
            })
        } catch (e) {
            return res.json({
                user: {}
            })
        }
    }
    async getUserList(req, res) {
        try {
            const userList = await User.find({ role: "STUDENT" }, { password: 0 })
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
}
module.exports = new authController()
