/*
 * @Author: marineyulxl
 * @Date: 2023-04-03 21:28:17
 * @LastEditTime: 2023-04-03 21:28:24
 */
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}

module.exports = authMiddleware;
