const Router = require("express");
const {check} = require("express-validator")
const router = new Router()
const checkRoleMiddleware = require('../middleware/checkRole.middleware');
const userContuoller = require('../controllers/userController')

router.post('/registration', checkRoleMiddleware(['ADMIN']),
    [   check('phon', 'Введите последние 10 цифр номера').isLength({min:10, max:10}),
        check('password', 'Пароль должен быть не короче 3-х и не длинее 12-ти символов').isLength({min:3, max:12})
    ], userContuoller.registration )
router.get('/userList', checkRoleMiddleware(['ADMIN']), userContuoller.getUserList )
router.get('/getUserExtend', checkRoleMiddleware(['ADMIN']), userContuoller.getUserExtend)
router.put('/user', checkRoleMiddleware(['ADMIN']), userContuoller.editUser)
router.delete('/user', checkRoleMiddleware(['ADMIN']), userContuoller.deleteUser)
router.put('/changePassword', checkRoleMiddleware(['ADMIN']), userContuoller.changePassword)

module.exports = router