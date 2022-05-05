const jwt = require('jsonwebtoken')
const config = require('config')

class tokenService {
    getUser(req) {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, config.get('secretKey'))
        return decoded
    }
}

module.exports = new tokenService()