const Router = require("express");
const {check} = require("express-validator")
const router = new Router()
const checkRoleMiddleware = require('../middleware/checkRole.middleware');
const userController = require('../controllers/userController')

router.post('/registration', checkRoleMiddleware(['ADMIN']),
    [   check('phon', 'Введите последние 10 цифр номера').isLength({min:10, max:10}),
        check('password', 'Пароль должен быть не короче 3-х и не длинее 12-ти символов').isLength({min:3, max:12})
    ], userController.registration )
router.get('/userList', checkRoleMiddleware(['ADMIN']), userController.getUserList )
router.get('/getUserExtend', checkRoleMiddleware(['ADMIN', 'CUR_STUDENT']), userController.getUserExtend)
router.put('/user', checkRoleMiddleware(['ADMIN']), userController.editUser)
router.delete('/user', checkRoleMiddleware(['ADMIN']), userController.deleteUser)
router.put('/changePassword', checkRoleMiddleware(['ADMIN']), userController.changePassword)

module.exports = router