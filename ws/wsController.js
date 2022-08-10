class wsController {
    async messageHandler(ws, message,aWss) {
        try {
            aWss.clients.forEach(client => {
                if (client.id === message.chatId || client.id === '62c069d297557c98a2ba729c')
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

