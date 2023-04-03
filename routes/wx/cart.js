/*
 * @Author: marineyulxl
 * @Date: 2023-04-03 21:28:49
 * @LastEditTime: 2023-04-03 21:28:55
 */
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add-to-cart', authMiddleware, async (req, res) => {
  // 处理添加到购物车的逻辑
});
