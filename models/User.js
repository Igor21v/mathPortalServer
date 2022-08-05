const {Schema, model, ObjectId} = require("mongoose")


const User = new Schema({
    phon: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    diskSpace: {type: Number, default: 1024**3*10},
    usedSpace: {type: Number, default: 0},
    avatar: {type: String},
    role: {type: String, default: 'STUDENT'},
    name: {type: String, default: ''},
    surname: {type: String, default: ''},
    files : [{type: ObjectId, ref:'File'}],
    messages : [{type: ObjectId, ref:'Message'}]
})

module.exports = model('User', User)