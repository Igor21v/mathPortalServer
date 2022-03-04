const {model, Schema, ObjectId} = require('mongoose')


const Theme = new Schema({
    name: {type: String, required: true},
    discription: {type: String},
    order: {type: Number},
    isPublic: {type: Boolean, default: true},
})

module.exports = model('Theme', Theme)
