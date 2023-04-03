/*
 * @Author: marineyulxl
 * @Date: 2023-04-03 10:45:10
 * @LastEditTime: 2023-04-03 11:42:46
 */
const express = require('express')
const router = express.Router()
const {createSwiper,getSwiper,updateSwiper,delectSwiper} =require('../../controllers/wx/swiper')
router.post('/swiper',createSwiper)
router.get('/swiper',getSwiper)
router.patch('/swiper/:id',updateSwiper)
router.delete('/swiper/:id',delectSwiper)
module.exports = router;