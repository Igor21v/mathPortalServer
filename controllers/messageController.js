const Message = require("../models/Message")
const User = require("../models/User")

class MessageController {

    async getMessagesList(req, res) {
        try {
            let messages = await Message.find({ chat: req.query.chatId }).sort({_id: -1})
            messages = JSON.parse(JSON.stringify(messages))
            messages = await Promise.all(messages.map(async message => {
                const author = await User.findById(message.author)
                message.authorName = author.name
                message.authorSurname = author.surname
                return message
            }))
            return res.json(messages)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }
}

module.exports = new MessageController()