/*
 * @Author: marineyulxl
 * @Date: 2023-03-31 17:12:05
 * @LastEditTime: 2023-04-18 22:31:58
 */
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware');
const {createOrder,updateOrderStatus,getOrderByUser,getAllOrders} =require('../controllers/order')

router.post('/order',authMiddleware,createOrder);
// router.get('/product',getProduct)
router.get('/order',authMiddleware,getOrderByUser)
router.get('/orders',authMiddleware,getAllOrders)
// router.delete('/product/:id',delectProduct)
router.patch('/order/:orderId',authMiddleware,updateOrderStatus)
module.exports = router;

