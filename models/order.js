/*
 * @Author: marineyulxl
 * @Date: 2023-04-11 15:34:23
 * @LastEditTime: 2023-04-12 15:33:27
 */
const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  orderNo: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productList: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  orderStatus: {
    type: String,
    enum: ['created', 'paid', 'delivered', 'completed', 'cancelled'],
    default: 'created'
  },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model('Order', orderSchema);
