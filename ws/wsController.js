class wsController {
    async messageHandler(ws, message,aWss) {
        try {
            aWss.clients.forEach(client => {
                client.send(JSON.stringify(message))
            })
        } catch (error) {
            console.log('Ошибка broadcastMessage ' + error)
        }
    }
    connectionHandler = (ws, message, aWss) => {
        ws.id = message.id
        this.messageHandler(ws, message, aWss)
    }
}
module.exports = new wsController()

