/*
 * @Author: marineyulxl
 * @Date: 2023-04-18 13:30:56
 * @LastEditTime: 2023-04-18 20:20:39
 */
const { Schema, model } = require('mongoose');

const adminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model('Administrator', adminSchema);
