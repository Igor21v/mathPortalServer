const tokenService = require('../services/tokenService')

module.exports = function (role) {
    return function (req, res, next) {
        try {
            console.log('req.headers.authorization' + req.headers.authorization)
            const decoded = tokenService.validateAccessToken(req)
            console.log('decod ' + JSON.stringify(decoded))
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