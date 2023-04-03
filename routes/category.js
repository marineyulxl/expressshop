const express = require('express')
const router = express.Router()

const {createCategory,findAllCategories,updateCategory,deleteCategory} =require('../controllers/category')


router.post('/category',createCategory)
router.get('/category',findAllCategories)
router.delete('./category/:id',deleteCategory)
router.patch('./category/:id',updateCategory)
module.exports = router;