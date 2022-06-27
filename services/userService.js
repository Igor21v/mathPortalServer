const fileService = require('./fileService')
const User = require('../models/User')
const path = require('path')


class UserService {

    async getExtendUser(filePath, userId, folder) {
        let user = await User.findById(userId, { password: 0 })
        user = JSON.parse(JSON.stringify(user))
        const filesPath = path.join(filePath, 'users', user._id, folder)
        const files = await fileService.getExtendFiles(filesPath)
        user.files = files
        return user
    }

}

module.exports = new UserService()