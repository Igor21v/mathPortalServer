const Router = require("express");
const {check} = require("express-validator")
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const checkRoleMiddleware = require('../middleware/checkRole.middleware');
const authController = require("../controllers/authController");


router.post('/registration', checkRoleMiddleware(['ADMIN']),
    [   check('phon', 'Введите последние 10 цифр номера').isLength({min:10, max:10}),
        check('password', 'Пароль должен быть не короче 3-х и не длинее 12-ти символов').isLength({min:3, max:12})
    ], authController.registration )
router.post('/login', authController.login)
router.get('/auth', authMiddleware, authController.auth)
router.get('/userList', checkRoleMiddleware(['ADMIN']), authController.getUserList )


module.exports = router
