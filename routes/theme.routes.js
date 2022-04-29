const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const themeController = require('../controllers/themeController')

router.post('', authMiddleware, themeController.createTheme)
router.post('/postFile', authMiddleware, themeController.postFile)
router.post('/postPicture', authMiddleware, themeController.postPicture)
router.get('',authMiddleware, themeController.getTheme)
router.get('/getListThemes', authMiddleware, themeController.getListThemes)
router.put('/edit', authMiddleware, themeController.editTheme)
router.delete('/deleteFile', authMiddleware, themeController.deleteFile)
router.delete('/deleteTheme', authMiddleware, themeController.deleteTheme)
router.delete('/deletePicture', authMiddleware, themeController.deletePicture)



module.exports = router
