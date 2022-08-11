const Router = require('express')
const router = new Router()
const checkRoleMiddleware = require('../middleware/checkRole.middleware')
const messageController = require('../controllers/messageController')

router.get('/getMessagesList', messageController.getMessagesList)

module.exports = router
