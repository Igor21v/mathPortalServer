const Router = require("express");
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const config = require("config")
const jwt = require("jsonwebtoken")
const {check, validationResult} = require("express-validator")
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')
const checkRoleMiddleware = require('../middleware/checkRole.middleware')


router.post('/registration', checkRoleMiddleware(['ADMIN']),
    [
        check('phon', 'Введите последние 10 цифр номера').isLength({min:10, max:10}),
        check('password', 'Пароль должен быть не короче 3-х и не длинее 12-ти символов').isLength({min:3, max:12})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: "Ошибка регистрации: " + errors.array()[0].msg})
        }
        const {phon, password} = req.body
        const candidate = await User.findOne({phon})
        if(candidate) {
            return res.status(400).json({message: `User with phon ${phon} already exist`})
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const user = new User({phon, password: hashPassword})
        await user.save()
        await fileService.createDir(req, new File({user:user.id, name: ''}))
        res.json({message: "User was created"})
    } catch (e) {
        console.log(e)
        res.send({message: "Server error"})
    }
})


router.post('/login',
    async (req, res) => {
        try {
            const {phon, password} = req.body
            const user = await User.findOne({phon})
            if (!user) {
                return res.status(404).json({message: "User not found"})
            }
            const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid) {
                return res.status(400).json({message: "Invalid password"})
            }
            const token = jwt.sign({id: user.id, role: user.role}, config.get("secretKey"), {expiresIn: "72h"})
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
            res.send({message: "Server error"})
        }
    })

router.get('/auth', authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user.id})  
            const token = jwt.sign({id: user.id, role: user.role}, config.get("secretKey"), {expiresIn: "24h"})
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
    })


module.exports = router
