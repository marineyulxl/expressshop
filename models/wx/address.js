/*
 * @Author: marineyulxl
 * @Date: 2023-04-06 17:31:13
 * @LastEditTime: 2023-04-08 19:50:38
 */
const { Schema, model } = require('mongoose')

const AddressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  telNumber: { type: String, required: true },
  provinceName: { type: String, required: true },
  cityName: { type: String, required: true },
  countyName: { type: String, required: true },
  isDefault:{type:Boolean,default:false},
  // postalCode:{type:String,required:true},
  detailInfo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model('Address', AddressSchema)