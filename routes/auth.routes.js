const Router = require("express");
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const authController = require("../controllers/authController");

router.post('/login', authController.login)
router.get('/auth', authMiddleware, authController.auth)

module.exports = router
