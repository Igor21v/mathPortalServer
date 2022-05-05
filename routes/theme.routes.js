const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const checkRoleMiddleware = require('../middleware/checkRole.middleware')
const themeController = require('../controllers/themeController')

router.post('', checkRoleMiddleware(['STUDENT']), themeController.createTheme)
router.post('/postFile', checkRoleMiddleware(['STUDENT']), themeController.postFile)
router.post('/postPicture', checkRoleMiddleware(['STUDENT']), themeController.postPicture)
router.get('', themeController.getTheme)
router.get('/getListThemes', themeController.getListThemes)
router.put('/edit', checkRoleMiddleware(['STUDENT']), themeController.editTheme)
router.delete('/deleteFile', checkRoleMiddleware(['ADMIN']), themeController.deleteFile)
router.delete('/deleteTheme', checkRoleMiddleware(['STUDENT']), themeController.deleteTheme)
router.delete('/deletePicture', checkRoleMiddleware(['STUDENT']), themeController.deletePicture)



module.exports = router
