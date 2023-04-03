/*
 * @Author: marineyulxl
 * @Date: 2023-04-01 19:23:51
 * @LastEditTime: 2023-04-02 16:27:19
 */
const { Schema, model } = require('mongoose')

const categorySchema = new Schema({
    name: { type: String, required: true , unique: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports=model('Category',categorySchema)