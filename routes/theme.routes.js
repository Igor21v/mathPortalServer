const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const themeController = require('../controllers/themeController')

router.post('', authMiddleware, themeController.createTheme)
router.get('', authMiddleware, themeController.getTheme)



module.exports = router
