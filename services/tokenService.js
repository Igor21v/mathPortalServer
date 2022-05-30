const jwt = require('jsonwebtoken')
const config = require('config')
const Token = require("../models/Token")

class tokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15s'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30s'})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveRefreshToken(userId, refreshToken) {
        const tokenData = await Token.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await Token.create({user: userId, refreshToken})
        return token;
    }

    validateAccessToken(req) {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, config.get('secretKey'))
        return decoded
    }
}


module.exports = new tokenService()