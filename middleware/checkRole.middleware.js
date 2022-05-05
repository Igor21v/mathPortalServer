const tokenService = require('../services/tokenService')

module.exports = function (role) {
    return function (req, res, next) {
        try {
            console.log('req.headers.authorization' + req.headers.authorization)
            const decoded = tokenService.getUser(req)
            if (!role.includes(decoded.role)) {
                return res.status(403).json({ message: 'Нарушение прав доступа' })
            }
            req.user = decoded
            next()
        }
        catch {
            console.log('req.user ' + req.user)
            return res.status(401).json({ message: 'Не авторизован' })
        }
    }
}