class wsController {
    async broadcastMessage(ws, message,aWss) {
        try {
            aWss.clients.forEach(client => {
                client.send(JSON.stringify(message))
            })
        } catch (error) {
            console.log('Ошибка broadcastMessage ' + error)
        }
    }
}
module.exports = new wsController()

