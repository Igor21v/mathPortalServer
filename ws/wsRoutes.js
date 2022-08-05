const wsController = require("./wsController")
class wsRoutes {
    connectionWS(aWss) {
        return (ws, req) => {
            ws.on('message', (message) => {
                message = JSON.parse(message)
                switch (message.event) {
                    case "message":
                        wsController.broadcastMessage(ws, message, aWss)
                        break
                    case "connection":
                        wsController.broadcastMessage(ws, message, aWss)
                        break
                }
            })
        }
    }
}
module.exports = new wsRoutes
