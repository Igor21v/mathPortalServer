const {Schema, model, ObjectId} = require("mongoose")


const Message = new Schema({
    date: {type: Date, required: true},
    user: {type: String},
    message: {type: Text},
})

module.exports = model('Message', Message)