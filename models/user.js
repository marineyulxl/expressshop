const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    openid: { type: String, required: true ,unique: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

module.exports=model('Users',userSchema)