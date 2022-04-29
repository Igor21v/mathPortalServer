const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
       return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, config.get('secretKey'))
        req.user = decoded
    } 
    catch {
        req.user = {email: 'guest'}

    }
    finally {
        next()
    }
}

/* res.status(401).json({message: 'Auth error1'}) */
