/*
 * @Author: marineyulxl
 * @Date: 2023-04-11 19:39:13
 * @LastEditTime: 2023-04-22 22:22:38
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
        console.log(1111,"wod",orderId);
        const newStatus = req.body.orderStatus;
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
            if (newStatus === 'created' && order.orderStatus !== '') {
              return res.status(400).json({
                  code: 400,
                  message: '不支持该订单状态'
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
            
            if (newStatus === 'completed' && order.orderStatus !== 'delivered') {
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
    async  getOrders(req, res, next) {
      console.log(req,'req');
      try {
        const { page = 1, limit = 10, orderStatus = '', sort = '' ,orderNo='',name = ''} = req.query;
        const skip = (page - 1) * limit;
        const query = {};
        if (orderStatus) {
          query.orderStatus = orderStatus;
        }
        if(orderNo){
          query.orderNo = orderNo
        }
        if (name) {
          query['shippingAddress.name'] = { $regex: name, $options: 'i' };
        }
        let sortObj = {};
        if (sort) {
          const [field, order] = sort.split(':');
          sortObj[field] = order === 'desc' ? -1 : 1;
        }
        const orders = await orderModel
          .find(query)
          .skip(skip)
          .limit(+limit)
          .sort(sortObj)
          .populate({
            path: 'productList.productId',
            select: 'name price images',
            populate: { path: 'category', select: 'name' }
          });
        const total = await orderModel.countDocuments(query);
        if (orders.length === 0) {
          res.status(404).json({
            code: 404,
            message: '未找到相关订单',
            data:[],
            total,
          });
        } else {
          res.status(200).json({
            code: 200,
            message: '查询成功',
            data: orders,
            total
          });
        }
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
      deleteOrders = async (req, res) => {
        const ids = req.body.ids;
        try {
          const deletedOrders = await orderModel.deleteMany({
            _id: { $in: ids }
          });
          if (deletedOrders.deletedCount === 0) {
            res.status(404).json({
              code: 404,
              message: '未找到符合条件的订单'
            });
            return;
          }
          res.status(200).json({
            code: 200,
            message: `已成功删除 ${deletedOrders.deletedCount} 个订单`,
            data: deletedOrders
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

