const Message = require("../models/Message")
const User = require("../models/User")

class MessageController {

    async getMessagesList(req, res) {
        try {
            const messages = await Message.find({ chat: req.query.chatId }).sort({ _id: -1 })
            return res.json(messages)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }
    async deleteMessages(req, res) {
        try {
            const messagesId = JSON.parse(req.query.messagesId)
            await Promise.all(messagesId.map(async messageId => {
                const message = await Message.findById(messageId)
                if (message) {
                    await message.remove()
                }
            }))
            const messages = await Message.find({ chat: req.query.chatId }).sort({ _id: -1 })
            return res.json(messages)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new MessageController()