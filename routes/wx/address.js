/*
 * @Author: marineyulxl
 * @Date: 2023-04-03 21:28:49
 * @LastEditTime: 2023-04-10 17:20:41
 */
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {createAddress,findAllAddresses,updateAddress,deleteAddress,findAddressById} =require('../../controllers/wx/address')
router.post('/address',authMiddleware,createAddress);
router.get('/address',authMiddleware,findAllAddresses);
router.get('/address/:addressId',authMiddleware,findAddressById)
router.put('/address/:addressId',authMiddleware,updateAddress)
router.delete('/address/:addressId',authMiddleware,deleteAddress)

module.exports =router