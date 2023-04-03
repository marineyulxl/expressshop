/*
 * @Author: marineyulxl
 * @Date: 2023-03-30 15:42:31
 * @LastEditTime: 2023-03-30 15:47:07
 */


module.exports = function (success, error) {

    if (typeof error !== 'function') {
        error = () => {
            console.log('连接失败~~~');
        }
    }
    const mongoose = require('mongoose')

    const { DBHOST, DBPORT, DBNAME } = require('../config/config.js')
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`)

    mongoose.connection.once('open', () => {
        success()
    });

    // 设置连接错误的回调
    mongoose.connection.on('error', () => {
        error()
    });

    //设置连接关闭的回调
    mongoose.connection.on('close', () => {
        console.log('连接关闭');
    });
}
