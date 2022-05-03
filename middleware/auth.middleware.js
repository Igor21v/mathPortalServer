const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, config.get('secretKey'))
        req.user = decoded
        next()
    }
    catch {
        res.status(401).json({ message: "Ошибка авторизации" })
    }
}

