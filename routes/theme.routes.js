const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const checkRoleMiddleware = require('../middleware/checkRole.middleware')
const themeController = require('../controllers/themeController')

router.post('', checkRoleMiddleware(['ADMIN']), themeController.createTheme)
router.post('/postFile', checkRoleMiddleware(['ADMIN']), themeController.postFile)
router.post('/postPicture', checkRoleMiddleware(['ADMIN']), themeController.postPicture)
router.get('', themeController.getTheme)
router.get('/getListThemes', themeController.getListThemes)
router.put('/edit', checkRoleMiddleware(['ADMIN']), themeController.editTheme)
router.delete('/deleteFile', checkRoleMiddleware(['ADMIN']), themeController.deleteFile)
router.delete('/deleteTheme', checkRoleMiddleware(['ADMIN']), themeController.deleteTheme)
router.delete('/deletePicture', checkRoleMiddleware(['ADMIN']), themeController.deletePicture)



module.exports = router
