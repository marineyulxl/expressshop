/*
 * @Author: marineyulxl
 * @Date: 2023-03-30 17:06:44
 * @LastEditTime: 2023-04-04 21:44:27
 */
const UsersModel = require('../models/user')
const request = require('request');
const { APPID, SECRET } = require('../config/login')
const jwt = require('jsonwebtoken')
const { statusCode, sendResponse } = require('../utils/sendResponse');
class UserController {
  //查询是否存在该id
  getUser = async (openid) => {
    const data = await UsersModel.findOne({ openid })
    if (!data) {
      this.addUser(openid)
      return
    }
    // console.log('数据时', data);
  }
  addUser = async (data) => {
    const user = await UsersModel.create({ openid: data })
  }
  //登录
  login = (req, res) => {
    const { code } = req.body;
    console.log('code', code);
    // 将 code 发送到微信服务器获取 openid 和 session_key
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`;
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        const { openid, session_key } = data;
        this.getUser(openid)
        let token = jwt.sign({ openid }, SECRET, {})
       
     
        res.json({
          code: 200,
          message: '登录成功',
          data: { token }
        });
      } else {
        res.json({
          code: 401,
          message: '登录失败',
        });
      }
    });
  }

}



module.exports = new UserController()