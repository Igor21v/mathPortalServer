const Message = require("../models/Message")
const User = require("../models/User")
const tokenService = require("../services/tokenService")

class wsController {
    async messageHandler(ws, message, aWss) {
        try {
            const messageBD = await new Message({ date: Date.now(), author: message.authorId, message: message.message, chat: message.chatId })
            const author = await User.findById(message.authorId)
            message._id = messageBD._id
            message.authorName = author.name
            const admin = await User.findOne({ role: 'ADMIN' })
            aWss.clients.forEach(client => {
                if (client.id === message.chatId || client.id == admin._id)
                    client.send(JSON.stringify(message))
            })
            await messageBD.save()
        } catch (error) {
            console.log('Ошибка отправки сообщения' + error)
        }
    }
    connectionHandler = (ws, message, aWss) => {
        try {
            console.log('message.accessToken ' + message.accessToken)
            const decoded = tokenService.validateAccessToken(message.accessToken)
            ws.id = decoded.id
            console.log('Авторизация по вебсокету пройдена, id пользователя: ' + decoded.id)
        } catch {
            console.log('Неудача авторизации по вебсокету')
            switch (message.event) {
                case 'connection':
                    ws.send(JSON.stringify({ event: 'reqRefresh' }))
                    break;
                case 'reconnection':
                    ws.close(1008)
                    break;
                default:
                    break;
            }
        }
    }
}
module.exports = new wsController()

/* 62be591aa12825192bc7f678
62c069d297557c98a2ba729c */
