class wsController {
    async messageHandler(ws, message,aWss) {
        try {
            aWss.clients.forEach(client => {
                if (client.id === message.chatId || client.id === '62be591aa12825192bc7f678')
                client.send(JSON.stringify(message))
            })
        } catch (error) {
            console.log('Ошибка broadcastMessage ' + error)
        }
    }
    connectionHandler = (ws, message, aWss) => {
        ws.id = message.userId
        this.messageHandler(ws, message,  )
    }
}
module.exports = new wsController()

