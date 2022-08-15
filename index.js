const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const fileUpload = require("express-fileupload")
const app = express()
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || config.get('serverPort')
const filePathMiddleware = require('./middleware/filepath.middleware')
const path = require('path')
const cors = require('cors');
const wsRoutes = require("./ws/wsRoutes")
const routes = require("./routes")
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json())
app.ws('/connectionWS', wsRoutes.connectionWS(aWss)) 
app.use(fileUpload({}))
app.use(cookieParser());
app.use(filePathMiddleware(path.resolve(__dirname, 'files')))
app.use(express.static(path.resolve('static')))
app.use('/themes', express.static(path.resolve('files', 'themes')))
routes.forEach((rout)=>{
    app.use(rout.path, rout.rout)
})

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