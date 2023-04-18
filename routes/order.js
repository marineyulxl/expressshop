/*
 * @Author: marineyulxl
 * @Date: 2023-03-31 17:12:05
 * @LastEditTime: 2023-04-13 14:50:34
 */
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware');
const {createOrder,updateOrderStatus,getOrderByUser} =require('../controllers/order')
//处理文件上传
router.post('/order',authMiddleware,createOrder);
// router.get('/product',getProduct)
router.get('/order',authMiddleware,getOrderByUser)
// router.get('/product/:id',getSingleProduct)
// router.delete('/product/:id',delectProduct)
router.patch('/order/:orderId',authMiddleware,updateOrderStatus)
module.exports = router;

