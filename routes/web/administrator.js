/*
 * @Author: marineyulxl
 * @Date: 2023-04-18 21:08:37
 * @LastEditTime: 2023-04-23 15:27:14
 */
const express = require('express')
const router = express.Router()
const authMiddleware = require('../../middlewares/authMiddleware');
const {register,login,updatePassword} =require('../../controllers/web/Administrator')

router.post('/web/register',register)
router.post('/web/login',login)
router.patch('/web/update',authMiddleware,updatePassword)
module.exports = router;