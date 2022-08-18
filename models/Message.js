const {Schema, model, ObjectId} = require("mongoose")


const Message = new Schema({
    date: {type: Date, required: true},
    authorId: {type: String, required: true},
    message: {type: String},
    chat: {type: ObjectId, ref: 'User'}
})

module.exports = model('Message', Message)