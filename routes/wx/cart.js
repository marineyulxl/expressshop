/*
 * @Author: marineyulxl
 * @Date: 2023-04-03 21:28:49
 * @LastEditTime: 2023-04-06 16:24:08
 */
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const {addToCart,getCart,deleteCartItem,updateCartItem,updateCartItemsChecked} =require('../../controllers/cart')
router.post('/cart',authMiddleware,addToCart);
router.get('/cart',authMiddleware,getCart);
router.delete('/cart/:productId',authMiddleware,deleteCartItem)
router.patch('/cart/:isChecked',authMiddleware,updateCartItemsChecked)
router.patch('/cart',authMiddleware,updateCartItem)

module.exports =router