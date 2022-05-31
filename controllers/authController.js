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
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
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

    async refresh(req, res) {
        try {
            const {refreshToken} = req.cookies;
     /*        const userData = await tokenService.refresh(refreshToken);
            
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}) */
            return res.json(userData);
           /*  async refresh(refreshToken) {
                if (!refreshToken) {
                    throw ApiError.UnauthorizedError();
                }
                const userData = tokenService.validateRefreshToken(refreshToken);
                const tokenFromDb = await tokenService.findToken(refreshToken);
                if (!userData || !tokenFromDb) {
                    throw ApiError.UnauthorizedError();
                }
                const user = await UserModel.findById(userData.id);
                const userDto = new UserDto(user);
                const tokens = tokenService.generateTokens({...userDto});
        
                await tokenService.saveToken(userDto.id, tokens.refreshToken);
                return {...tokens, user: userDto}
            }
        
            async getAllUsers() {
                const users = await UserModel.find();
                return users;
            } */
        } catch (e) {
            return res.status(401).json({ message: 'Не авторизован' })
        }
    }

}

module.exports = new authController()
