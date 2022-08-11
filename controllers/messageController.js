const User = require("../models/User")

class MessageController {

    async getMessagesList(req, res) {
        try {
            const user = await User.findById(req.query.chatId)             
            return res.json(user.messages)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }
}

module.exports = new MessageController()