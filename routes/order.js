/*
 * @Author: marineyulxl
 * @Date: 2023-03-31 17:12:05
 * @LastEditTime: 2023-04-21 20:54:28
 */
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware');
const {createOrder,updateOrderStatus,getOrderByUser,getOrders,deleteOrder,deleteOrders} =require('../controllers/order')

router.post('/order',authMiddleware,createOrder);
// router.get('/product',getProduct)
router.get('/order',authMiddleware,getOrderByUser)
router.get('/orders',authMiddleware,getOrders)
// router.delete('/product/:id',delectProduct)
router.patch('/order/:orderId',authMiddleware,updateOrderStatus)
router.delete('/order/:orderId',authMiddleware,deleteOrder)
router.delete('/order',authMiddleware,deleteOrders)
module.exports = router;

