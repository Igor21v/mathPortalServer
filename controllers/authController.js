const User = require("../models/User")
const bcrypt = require("bcryptjs")
const config = require("config")
const jwt = require("jsonwebtoken")
const tokenService = require("../services/tokenService")

class authController {

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
            const tokens = tokenService.generateTokens({ id: user.id, role: user.role })
            await tokenService.saveRefreshToken(user._id, tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            console.log('kkkkk ' + res.cookie)
            return res.json({
                token: tokens.accessToken,
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

    async refresh(req, res) {
        try {

            const { refreshToken } = req.cookies;
            const decoded = tokenService.validateRefreshToken(refreshToken);

            const tokenFromDb = await tokenService.findToken(refreshToken);
            const user = await User.findById(decoded.id);

            if (!user || !tokenFromDb) {
                throw ({ message: 'Не авторизован' })
            }
            const tokens = tokenService.generateTokens({ id: user.id, role: user.role });
            await tokenService.saveRefreshToken(user._id, tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            console.log(',,, ' + tokens.refreshToken)
            return res.json({
                token: tokens.accessToken,
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
            console.log('ошбика' + e)
            return res.json({
                user: {
                    role: 'PUBLIC'
                }
            })
        }
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const token = await tokenService.removeToken(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch {
            res.send({ message: "Server error" })
        }
    }

}

module.exports = new authController()
