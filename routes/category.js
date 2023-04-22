/*
 * @Author: marineyulxl
 * @Date: 2023-04-01 19:33:28
 * @LastEditTime: 2023-04-22 21:37:41
 */
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware');
const {createCategory,findAllCategories,updateCategory,deleteCategory,findCategories} =require('../controllers/category')


router.post('/category',authMiddleware,createCategory)
router.get('/category',findAllCategories)
router.get('/limitCategory',authMiddleware,findCategories)
router.delete('/category/:id',authMiddleware,deleteCategory)
router.patch('/category/:id',authMiddleware,updateCategory)

module.exports = router;