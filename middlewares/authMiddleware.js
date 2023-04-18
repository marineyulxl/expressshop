/*
 * @Author: marineyulxl
 * @Date: 2023-04-03 21:28:17
 * @LastEditTime: 2023-04-05 14:14:53
 */
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const {  SECRET } = require('../config/login')


async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({code:401, message: 'NO authHeader' });
  }
  let token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({code:401, message: '没有token.' });
  }

 1
  try {
    const decodedToken =jwt.verify(token, SECRET);
    const user = await UserModel.findOne({openid:decodedToken.openid});

    if (!user) {
      return res.status(401).json({ message: '没有该用户' });
    }
    req.user = user;
   
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: '无效的token' });
  }
}

module.exports = authMiddleware;


