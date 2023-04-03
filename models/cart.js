/*
 * @Author: marineyulxl
 * @Date: 2023-04-02 16:27:13
 * @LastEditTime: 2023-04-02 16:28:29
 */
const { Schema, model } = require('mongoose')

const CartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
module.exports = model('Cart', CartSchema)

