/*
 * @Author: marineyulxl
 * @Date: 2023-03-31 17:01:09
 * @LastEditTime: 2023-03-31 17:05:15
 */
const { Schema, model } = require('mongoose')

const productSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    // stock: { type: Number, default: 0 },
    // sales: { type: Number, default: 0 },
    // isOnSale: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

module.exports = model('Product', productSchema)