/*
 * @Author: marineyulxl
 * @Date: 2023-03-30 15:47:54
 * @LastEditTime: 2023-04-18 22:36:24
 */
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    openid: { type: String, required: true ,unique: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

module.exports=model('User',userSchema)