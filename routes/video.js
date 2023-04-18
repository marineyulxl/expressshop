/*
 * @Author: marineyulxl
 * @Date: 2023-04-16 16:43:50
 * @LastEditTime: 2023-04-16 16:55:06
 */
const express = require('express')
const router = express.Router()

const {createVideo,getVideo} =require('../controllers/video.js')
//处理文件上传
router.post('/video',createVideo);
router.get('/video',getVideo)
// router.get('/productAll',getAllProduct)
// router.get('/product/:id',getSingleProduct)
// router.delete('/product/:id',delectProduct)
// router.patch('/product/:id',updateProduct)
module.exports = router;