/*
 * @Author: marineyulxl
 * @Date: 2023-03-29 19:18:53
 * @LastEditTime: 2023-03-29 20:06:01
 */

module.exports = {
    CODE_ERROR: 1001, // 请求响应失败code码
    CODE_SUCCESS: 2000, // 请求响应成功code码
    CODE_TOKEN_EXPIRED: 401, // 授权失败
    PRIVATE_KEY: 'luxinglong', // 自定义jwt加密的私钥
    JWT_EXPIRED: 60 * 60 * 24, // 过期时间24小时
  } 