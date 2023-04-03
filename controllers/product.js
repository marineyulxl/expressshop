/*
 * @Author: marineyulxl
 * @Date: 2023-03-31 17:05:54
 * @LastEditTime: 2023-04-03 21:14:38
 */

const { model } = require('mongoose');
const productModel = require('../models/product')
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
class ProductController {
    //删除图片
    deleteProductImages = async (images) => {
        if(images instanceof Array){
            for (const item of images) {
                const filePath = path.join(__dirname, '../public', item);
                try {
                    await fs.promises.unlink(filePath);
                    console.log('File removed:', filePath);
                } catch (error) {
                    console.error('Error removing file:', error);
                }
            }
        }
        const filePath = path.join(__dirname, '../public', images);
        try {
            await fs.promises.unlink(filePath);
            console.log('File removed:', filePath);
        } catch (error) {
            console.error('Error removing file:', error);
        }
    }
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
        const { page = 1, limit = 10, name = '', category = '', sort = '' } = req.query;
        const skip = (page - 1) * limit;
        const query = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            query.category = category;
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
            .then((data) => {
                res.status(200).json({
                    code: 200,
                    message: '查询成功',
                    data: data,
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
            const product = await productModel.findOne({ _id: id });
            if (!product) {
                return res.status(404).json({
                    code: 404,
                    message: '商品不存在',
                });
            }

            const result = await productModel.deleteOne({ _id: id });
            await this.deleteProductImages(product.images);

            return res.status(200).json({
                code: 200,
                message: '删除成功',
                data: result,
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
        //   console.log(deleteImages);
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
    

}
module.exports = new ProductController()