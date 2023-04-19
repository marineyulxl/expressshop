/*
 * @Author: marineyulxl
 * @Date: 2023-04-18 21:08:37
 * @LastEditTime: 2023-04-18 21:52:32
 */
const express = require('express')
const router = express.Router()

const {register,login} =require('../../controllers/web/Administrator')

router.post('/web/register',register)
router.post('/web/login',login)
module.exports = router;