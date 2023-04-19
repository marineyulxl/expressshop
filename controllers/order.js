/*
 * @Author: marineyulxl
 * @Date: 2023-04-11 19:39:13
 * @LastEditTime: 2023-04-18 22:25:26
 */

const orderModel = require('../models/order');
const shortid = require('shortid');
class OrderController {
    generateOrderId() {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const randomPart = shortid.generate().toUpperCase();
        return `${year}${month}${day}${randomPart}`;
    }
    createOrder = async (req, res) => {
        const userId = req.user._id;
        const { productList, shippingAddress } = req.body;

        let totalPrice = 0;
        productList.forEach(item => {
            totalPrice += item.price * item.quantity
        });
        totalPrice = +totalPrice.toFixed(2);
        console.log(totalPrice);
        const orderNo = this.generateOrderId()
        try {
            const createdOrder = await orderModel.create({
                orderNo,
                user: userId,
                productList,
                shippingAddress,
                totalPrice
            });

            res.status(200).json({
                code: 200,
                message: '订单创建成功',
                data: createdOrder
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                code: 500,
                message: '服务器错误'
            });
        }
    }
    async updateOrderStatus(req, res) {
        const orderId = req.params.orderId;
        const newStatus = req.body.status;
        try {
            const order = await orderModel.findById({_id:orderId});
    
            if (!order) {
                return res.status(404).json({
                    code: 404,
                    message: '订单不存在'
                });
            }
    
            if (order.orderStatus === newStatus) {
                return res.status(400).json({
                    code: 400,
                    message: `订单状态已经是${newStatus}`
                });
            }
    
            if (newStatus !== 'created' && newStatus !== 'paid' && newStatus !== 'completed' && newStatus !== 'delivered' && newStatus !== 'canceled') {
                return res.status(400).json({
                    code: 400,
                    message: '不支持该订单状态'
                });
            }
    
            if (order.orderStatus === 'canceled') {
                return res.status(400).json({
                    code: 400,
                    message: '该订单已被取消'
                });
            }
    
            if (newStatus === 'paid' && order.orderStatus !== 'created') {
                return res.status(400).json({
                    code: 400,
                    message: '订单状态不正确，无法更新为已支付'
                });
            }
    
            if (newStatus === 'delivered' && order.orderStatus !== 'paid') {
                return res.status(400).json({
                    code: 400,
                    message: '订单状态不正确，无法更新为已发货'
                });
            }
    
            if (newStatus === 'delivered' && order.orderStatus !== 'completed') {
                return res.status(400).json({
                    code: 400,
                    message: '订单状态不正确，无法更新为已收货'
                });
            }
            
            order.orderStatus = newStatus;
            order.updatedAt = Date.now()
            await order.save();
    
            res.status(200).json({
                code: 200,
                message: '订单状态已更新',
                data: order
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                code: 500,
                message: '服务器错误'
            });
        }
    }
    async getOrderByUser(req,res){
        try{
        const userId = req.user._id;
        const orders = await orderModel.find({ user: userId }).populate('productList.productId','name price images');
        console.log(orders);
        res.status(200).json({
            code: 200,
            message: '获取订单信息成功',
            data: orders
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({
            code: 500,
            message: '服务器错误'
          });
        }
    }
    async getAllOrders(req, res) {
        try {
          const orders = await orderModel.find().populate('user productList.productId', 'username phone email name price images');
          console.log(orders);
          res.status(200).json({
            code: 200,
            message: '获取订单信息成功',
            data: orders
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({
            code: 500,
            message: '服务器错误'
          });
        }
      }
      
    deleteOrder = async (req, res) => {
        const orderId = req.params.orderId;
        try {
          const deletedOrder = await orderModel.findOneAndDelete({
            _id: orderId
          });
          if (!deletedOrder) {
            res.status(404).json({
              code: 404,
              message: '未找到该订单'
            });
            return;
          }
          res.status(200).json({
            code: 200,
            message: '订单删除成功',
            data: deletedOrder
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({
            code: 500,
            message: '服务器错误'
          });
        }
      };
      
}

module.exports = new OrderController();

