const Message = require("../models/Message")
const User = require("../models/User")

class wsController {
    async messageHandler(ws, message,aWss) {
        try {
            console.log('Отправка сообщения ' + message.event)
            const messageBD = await new Message({date: Date.now(), author: message.authorId, message: message.message, chat: message.chatId})
            const author = await User.findById(message.authorId)
            message._id = messageBD._id
            message.authorName = author.name
            aWss.clients.forEach(client => {
                if (client.id === message.chatId || client.id === '62be591aa12825192bc7f678')
                client.send(JSON.stringify(message))
            })
            await messageBD.save()
        } catch (error) {
            console.log('Ошибка отправки сообщения' + error)
        }
    }
    connectionHandler = (ws, message, aWss) => {
        ws.id = message.userId
    }
}
module.exports = new wsController()

/* 62be591aa12825192bc7f678
62c069d297557c98a2ba729c */
