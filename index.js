const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const fileUpload = require("express-fileupload")
const authRouter = require("./routes/auth.routes")
const fileRouter = require("./routes/file.routes")
const themeRouter = require("./routes/theme.routes")
const userRoutes = require("./routes/user.routes")
const app = express()
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || config.get('serverPort')
const corsMiddleware = require('./middleware/cors.middleware')
const cors = require('cors');
/* const cors = require('cors'); */
const filePathMiddleware = require('./middleware/filepath.middleware')
const path = require('path')
const ws = require('ws');
const wss = new ws.Server({
    port: 8080,
}, () => console.log(`Websocket started on 8080`))

wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        switch (message.event) {
            case 'message':
                broadcastMessage(message)
                break;
            case 'connection':
                broadcastMessage(message)
                break;
        }
    })
})

function broadcastMessage(message, id) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}


app.use(express.json())
app.use(fileUpload({}))
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
/* app.use(corsMiddleware) */
app.use(filePathMiddleware(path.resolve(__dirname, 'files')))
app.use(express.static(path.resolve('static')))
app.use('/themes', express.static(path.resolve('files', 'themes')))
app.use("/api/auth", authRouter)
app.use("/api/files", fileRouter)
app.use("/api/theme", themeRouter)
app.use('/api/user', userRoutes)

const start = async () => {
    try {
        await mongoose.connect(config.get("dbUrl"), {
            useNewUrlParser:true,
            useUnifiedTopology:true
        })


        app.listen(PORT, () => {
            console.log('Server started on port ', PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

console.log("Идентификатор процесса:" + process.pid);      

start()