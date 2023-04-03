/*
 * @Author: marineyulxl
 * @Date: 2023-04-02 16:49:06
 * @LastEditTime: 2023-04-03 10:39:23
 */

const {model,Schema} = require('mongoose')

const swiperSchema = new Schema({
    imageUrl: { type: String, required: true },
    // linkUrl: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})
module.exports = model('Swiper',swiperSchema)