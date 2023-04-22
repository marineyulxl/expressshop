/*
 * @Author: marineyulxl
 * @Date: 2023-03-31 17:12:05
 * @LastEditTime: 2023-04-22 21:37:07
 */
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware');
const {createProduct,getProduct,delectProduct,updateProduct,getSingleProduct,getAllProduct,deleteProducts} =require('../controllers/product')
//处理文件上传
router.post('/product',authMiddleware,createProduct);
router.get('/product',getProduct)
router.get('/productAll',authMiddleware,getAllProduct)
router.get('/product/:id',getSingleProduct)
router.delete('/product/:id',authMiddleware,delectProduct)
//批量删除
router.delete('/product',authMiddleware,deleteProducts)
router.patch('/product/:id',authMiddleware,updateProduct)
module.exports = router;