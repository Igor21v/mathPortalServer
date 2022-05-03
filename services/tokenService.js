const jwt = require('jsonwebtoken')
const config = require('config')

class tokenService {
    getUser(req) {
        console.log('req.headers.authorization ' + req.headers.authorization)
        const token = req.headers.authorization.split(' ')[1]
        console.log('token ' + token)
        const decoded = jwt.verify(token, config.get('secretKey'))
        console.log('decoded ' + decoded.role)
        return decoded
    }
}

module.exports = new tokenService()