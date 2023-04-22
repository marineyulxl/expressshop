/*
 * @Author: marineyulxl
 * @Date: 2023-04-16 16:43:50
 * @LastEditTime: 2023-04-22 21:38:01
 */
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware');
const {createVideo,getVideo} =require('../controllers/video.js')
//处理文件上传
router.post('/video',authMiddleware,createVideo);
router.get('/video',getVideo)
// router.get('/productAll',getAllProduct)
// router.get('/product/:id',getSingleProduct)
// router.delete('/product/:id',delectProduct)
// router.patch('/product/:id',updateProduct)
module.exports = router;