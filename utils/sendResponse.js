/*
 * @Author: marineyulxl
 * @Date: 2023-04-01 21:08:43
 * @LastEditTime: 2023-04-01 21:10:17
 */
const statusCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  };
  
  const sendResponse = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
      code: statusCode,
      message: message,
      data: data
    });
  };
  
  module.exports = { statusCode, sendResponse };
  