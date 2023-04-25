/*
 * @Author: marineyulxl
 * @Date: 2023-04-02 16:27:06
 * @LastEditTime: 2023-04-25 14:19:27
 */

const CartModel =require('../models/cart')
class cartController {
    //添加商品
    async addToCart(req, res) {
        const userId = req.user._id; // 获取用户ID

        const { productId, quantity } = req.body; // 获取要添加的商品ID和数量
       
        try {
          // 查询购物车中是否已存在该商品
          const cartItem = await CartModel.findOne({ user: userId, 'products.product': productId });
            console.log(cartItem);
          if (cartItem) {
            // 如果已存在该商品，则更新数量
            await CartModel.updateOne(
              { user: userId, 'products.product': productId },
              { $inc: { 'products.$.quantity': quantity }, updatedAt: new Date() }
            );
          } else {
            // 如果不存在该商品，则添加到购物车
             await CartModel.updateOne(
              { user: userId },
              { $push: { products: { product: productId, quantity } }, updatedAt: new Date() },
              { upsert: true }
            );
          }
      
          return res.status(200).json({code:200, message: '添加成功' ,data:{}});
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: '服务器错误' });
        }
      }
    //   查询商品
      async  getCart(req, res) {
        const userId = req.user._id; // 获取用户ID
        
        try {
          const cart = await CartModel.findOne({ user: userId }) .populate({
            path: 'products.product',
            select: 'name price images'
          })
          .select('-__v -createdAt -updatedAt ');
          if (!cart) {
            return res.status(404).json({ message: '购物车为空' });
          }
          
          //解构代码
          const products = cart.products.map(item => {
            const { _id, product, quantity, isChecked } = item;
            const { _id:productId, name, price ,images} = product;
            return { productId, name, price, quantity, isChecked ,images};
          });
          const result = {
            cart: {
              _id: cart._id,
              user: cart.user,
              products
            }
          };
            // console.log(cart);
          return res.status(200).json({ code: 200, message: 'Success', data: result });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: '服务器错误' });
        }
      }
      //删除商品
      async deleteCartItem(req, res) {
        const userId = req.user._id; // 获取用户ID
        const { productId } = req.params; // 获取要删除的商品ID
        
        try {
          // 查询购物车中是否存在该商品
          const cartItem = await CartModel.findOne({ user: userId, 'products.product': productId });
          if (!cartItem) {
            return res.status(400).json({ code: 400, message: 'Product not found in cart.' });
          }
          
          // 删除购物车中指定商品
          await CartModel.updateOne(
            { user: userId },
            { $pull: { products: { product: productId } }, updatedAt: new Date() }
          );
      
          return res.status(200).json({ code: 200, message: '删除成功', data: {} });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'server error.' });
        }
      } 
      //修改商品
      async updateCartItem(req, res) {
        const userId = req.user._id;
        const { productId, quantity, isChecked } = req.body;
      
        try {
          const cartItem = await CartModel.findOne({ user: userId, 'products.product': productId });
          if (!cartItem) {
            return res.status(400).json({ message: '购物车中没有该商品' });
          }
      
          const updateFields = { updatedAt: new Date() };
          if (quantity) {
            updateFields['products.$.quantity'] = quantity;
          }
          if (typeof isChecked === 'boolean') {
            updateFields['products.$.isChecked'] = isChecked;
          }
      
          await CartModel.updateOne(
            { user: userId, 'products.product': productId },
            { $set: updateFields }
          );
      
          return res.status(200).json({code:200, message: '购物车商品更新成功' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({code:500, message: '服务器错误' });
        }
      }
      //修改全部勾选状态
      async updateCartItemsChecked(req, res) {
        const userId = req.user._id;
        const isChecked = req.params.isChecked === 'true'; // 将字符串转换为布尔值
        try {
          await CartModel.updateMany(
            { user: userId },
            { $set: { 'products.$[].isChecked': isChecked, updatedAt: new Date() } }
          );
      
          return res.status(200).json({ code: 200, message: '购物车商品更新成功' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ code: 500, message: '服务器错误' });
        }
      }
      
      
}
module.exports = new cartController()