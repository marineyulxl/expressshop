/*
 * @Author: marineyulxl
 * @Date: 2023-03-31 17:05:54
 * @LastEditTime: 2023-04-21 15:45:05
 */

const { model } = require('mongoose');
const productModel = require('../models/product')
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
class ProductController {
    //删除图片
    deleteProductImages = async (images) => {
        try {
          if (Array.isArray(images)) { // 检查 images 是否为数组
            for (const image of images) {
              const imagePath = path.join(__dirname, '../public', image);
              await fs.promises.unlink(imagePath);
              console.log(`File removed: ${imagePath}`);
            }
          } else { // images 是字符串，直接删除文件
            const imagePath = path.join(__dirname, '../public', images);
            await fs.promises.unlink(imagePath);
            console.log(`File removed: ${imagePath}`);
          }
        } catch (error) {
          console.error(`Error removing file: ${error}`);
        }
      };
      
    //创建商品
    createProduct = async (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        // 创建 form 对象
        const form = formidable({
            multiples: true,
            // 设置上传文件的保存目录
            uploadDir: __dirname + '/../public/images',
            // 保持文件后缀
            keepExtensions: true
        });
        try {
            const { fields, files } = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ fields, files });
                    }
                });
            });

            const { name, description, category, price } = fields;

            const images = [];
            
            // 将文件添加到images数组中
            if (files.images instanceof Array) {
                files.images.forEach(item => {
                    let url = '/images/' + item.newFilename;
                    images.push(url);
                });
            } else {
                let url = '/images/' + files.images.newFilename;
                images.push(url);
            }
            
            // 创建新产品
            const newProduct = await productModel.create({
                name,
                description,
                category,
                price,
                images
            });

            res.status(200).json({
                code: 200,
                message: '创建成功',
                data: newProduct
            });
        } catch (error) {
            console.error(error);
            res.status(400).json({
                code: 400,
                message: '创建失败：缺少必要字段或请求不合法',
                data: null
            });

        }
    };
    //按需查询商品
    getProduct(req, res, next) {
        console.log(req.query);
        const { page = 1, limit = 10, name = '', category = '', sort = '' } = req.query;
        
        const skip = (page - 1) * limit;
        const query = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            query.category = category;
            console.log(query.category);
        }
        let sortObj = {};
        if (sort) {
            const [field, order] = sort.split(':');
            //asc||desc
            sortObj[field] = order === 'desc' ? -1 : 1;
        }
        productModel
            .find(query)
            .skip(skip)
            .limit(+limit)
            .sort(sortObj)
            .populate('category', 'name')
            .then(async (data) => {
                const count = await productModel.countDocuments(query);
                if (data.length === 0) {
                    res.status(404).json({
                        code: 404,
                        message: '查询结果为空',
                        data: [],
                        total: count,
                    });
                } else {
                    res.status(200).json({
                        code: 200,
                        message: '查询成功',
                        data: data,
                        total: count,
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    code: 500,
                    message: '查询失败',
                    data: null,
                });
            });
    }
    //查询所有商品
    async getAllProduct(req,res,next){
        try{
        const products = await productModel.find().populate('category','name')
        if (!products) {
            return res.status(404).json({
              code: 404,
              message: '没有找到任何产品'
            });
          }
      
          res.status(200).json({
            code: 200,
            message: '查询成功',
            data: products
          });
        }catch(err){
            console.error(err);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    }); 
        }
    }
    //删除商品  
    delectProduct = async (req, res, next) => {
        const id = req.params.id;
        console.log(id);

        try {
            const product = await productModel.findByIdAndDelete(id);
            console.log(product,"product");
            if (!product) {
                return res.status(404).json({
                    code: 404,
                    message: '商品不存在',
                });
            }
            await this.deleteProductImages(product.images);

            return res.status(200).json({
                code: 200,
                message: '删除成功',
                data: product,
            });
        } catch (error) {
            return res.status(500).json({
                code: 500,
                message: '删除商品出错',
                error: error.message,
            });
        }
    }
    // 修改商品
    updateProduct = async (req, res, next) => {
        // console.log(req.params);
        res.setHeader('Access-Control-Allow-Origin', '*');
        const form = formidable({
          multiples: true,
          uploadDir: __dirname + '/../public/images',
          keepExtensions: true
        });
      
        try {
          const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
              if (err) {
                reject(err);
              } else {
                resolve({ fields, files });
              }
            });
          });
          const productId = req.params.id;
          const { name, description, category, price } = fields;
      
          let images = [];
          
          if (files.images) {
            if (files.images instanceof Array) {
              files.images.forEach(item => {
                let url = '/images/' + item.newFilename;
                images.push(url);
              });
            } else {
              let url = '/images/' + files.images.newFilename;
              images.push(url);
            }
          }
      
          // 判断是否需要删除图片
          const deleteImages = fields.deleteImages;
          console.log(deleteImages,'deleteImages');
          if (deleteImages && deleteImages.length > 0) {
            await productModel.findByIdAndUpdate(productId, { $pull: { images: { $in: deleteImages } } });
            //掉用删除图片的方法
            await this.deleteProductImages(deleteImages);
        }
          
          const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            {
              name,
              description,
              category,
              price,
              $push: { images: { $each: images } }
            },
            { new: true }
          );
      
          res.status(200).json({
            code: 200,
            message: '更新成功',
            data: updatedProduct
          });
        } catch (error) {
          console.error(error);
          res.status(400).json({
            code: 400,
            message: '更新失败：缺少必要字段或请求不合法',
            data: null
          });
        }
      };
      getSingleProduct(req, res, next) {
        const productId = req.params.id; // Get the product ID from the request parameters
        console.log(productId);
        productModel
            .findById(productId) // Query the product by ID
            .populate('category', 'name')
            .then((product) => {
                if (!product) {
                    return res.status(404).json({
                        code: 404,
                        message: '商品不存在',
                        data: null,
                    });
                }
                res.status(200).json({
                    code: 200,
                    message: '查询成功',
                    data: product,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    code: 500,
                    message: '查询失败',
                    data: null,
                });
            });
    }
    deleteProducts = async (req, res, next) => {
        const ids = req.body.ids;
        console.log(req.body);
        try {
          const products = await productModel.find({ _id: { $in: ids } });
          if (products.length === 0) {
            return res.status(404).json({
              code: 404,
              message: '没有找到要删除的商品',
            });
          }
      
          const deletedProducts = [];
          for (let i = 0; i < products.length; i++) {
            const product = products[i];
            await this.deleteProductImages(product.images);
            const deletedProduct = await productModel.findByIdAndDelete(product._id);
            deletedProducts.push(deletedProduct);
          }
      
          return res.status(200).json({
            code: 200,
            message: '批量删除成功',
            data: deletedProducts,
          });
        } catch (error) {
          return res.status(500).json({
            code: 500,
            message: '批量删除商品出错',
            error: error.message,
          });
        }
      };
      

}
module.exports = new ProductController()