const tokenService = require('../services/tokenService')

module.exports = function (role) {
    return function (req, res, next) {
        try {
            console.log('2 ' + req.headers.authorization)
            const decoded = tokenService.validateAccessToken(req.headers.authorization.split(' ')[1])
            console.log('decoded from token: ' + JSON.stringify(decoded))
            if (!role.includes(decoded.role)) {
                if (!(role.includes('CUR_STUDENT') && ((req.body.userId || req.query.userId) == decoded.id)))
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