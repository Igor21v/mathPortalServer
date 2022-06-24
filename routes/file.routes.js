const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileController = require('../controllers/fileController')
const checkRoleMiddleware = require('../middleware/checkRole.middleware');

router.post('', authMiddleware, fileController.createDir)
router.post('/write', authMiddleware, fileController.change)
router.get('/read', authMiddleware, fileController.read)
router.post('/upload', authMiddleware, fileController.uploadFile)
router.post('/avatar', authMiddleware, fileController.uploadAvatar)
router.get('', authMiddleware, fileController.getFiles)
router.get('/download', authMiddleware, fileController.downloadFile)
router.get('/search', authMiddleware, fileController.searchFile)
router.delete('/', authMiddleware, fileController.deleteFile)
router.delete('/avatar', authMiddleware, fileController.deleteAvatar)
router.get('/downloadUserFile', checkRoleMiddleware(['ADMIN', 'USER']), fileController.downloadUserFile)
router.post('/postUserFile', checkRoleMiddleware(['ADMIN', 'USER']), fileController.postUserFile)


module.exports = router
