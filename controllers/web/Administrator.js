const AdministratorModel = require('../../models/web/Administrator')
const bcrypt = require('bcrypt');
const { SECRET } = require('../../config/login')
const jwt = require('jsonwebtoken')
class AdministratorController{
    async register(req, res) {
        const { username, password } = req.body;
        try {
          const existingAdmin = await AdministratorModel.findOne({ username });
    
          if (existingAdmin) {
            return res.status(400).json({
              code: 400,
              message: '用户名已被注册'
            });
          }
           // 将密码进行哈希处理
      const hashedPassword = await bcrypt.hash(password, 10);
          const createdAdmin = await AdministratorModel.create({
            username,
            password: hashedPassword
          });
    8
          res.status(201).json({
            code: 201,
            message: '注册成功',
            data: createdAdmin
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({
            code: 500,
            message: '服务器错误'
          });
        }
      }
        // 登录
  async login(req, res) {
    const { username, password } = req.body;

    try {
      const admin = await AdministratorModel.findOne({ username });

      if (!admin) {
        return res.status(400).json({
          code: 400,
          message: '用户名或密码错误'
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, admin.password);

      if (!isPasswordMatch) {
        return res.status(400).json({
          code: 400,
          message: '用户名或密码错误'
        });
      }

      // 生成 token
      const token = jwt.sign({ adminId: admin._id }, SECRET, { expiresIn: '1h' });

      res.status(200).json({
        code: 200,
        message: '登录成功',
        data: {
          token,
          admin: {
            adminId: admin._id,
            username: admin.username
          }
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
}

module.exports = new AdministratorController()