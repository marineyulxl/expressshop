/*
 * @Author: marineyulxl
 * @Date: 2023-04-03 21:28:17
 * @LastEditTime: 2023-04-25 14:10:59
 */
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const AdministratorModel = require('../models/web/Administrator')
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

  try {
    const decodedToken =jwt.verify(token, SECRET);
    const { openid, adminId } = decodedToken;
    if(openid){
      const user = await UserModel.findOne({openid});

      if (!user) {
        return res.status(401).json({ message: '没有该用户' });
      }
      req.user = user;
      next();
    }else if(adminId){
        const admin = await AdministratorModel.findById(adminId)
        if (!admin) {
          return res.status(401).json({ message: '没有该用户' });
        }
        req.admin =admin.username
        req.adminId=adminId
        console.log(1);
        next()
    }else {
      return res.status(401).json({ message: '无效的token' });
    }
    
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: '无效的token' });
  }
}

module.exports = authMiddleware;


