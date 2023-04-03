/*
 * @Author: marineyulxl
 * @Date: 2023-03-31 17:12:05
 * @LastEditTime: 2023-04-03 19:25:44
 */
const express = require('express')
const router = express.Router()

const {createProduct,getProduct,delectProduct,updateProduct,getSingleProduct,getAllProduct} =require('../controllers/product')
//处理文件上传
router.post('/product',createProduct);
router.get('/product',getProduct)
router.get('/productAll',getAllProduct)
router.get('/product/:id',getSingleProduct)
router.delete('/product/:id',delectProduct)
router.patch('/product/:id',updateProduct)
module.exports = router;