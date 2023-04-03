const swiperModel = require('../../models/wx/swiper')
const fs = require('fs');
const path = require('path');

const util = require('util')
const formidable = require('formidable');
class swiperCotroller {
    //创建swiper
    async createSwiper(req, res, next) {
        const form = formidable({
            multiples: true,
            uploadDir: __dirname + '/../../public/swiper',
            keepExtensions: true
        })
        try {
            const { fields, files } = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ fields, files });
                    }
                })
            })
            // 只能上传一张图片
            if (Object.keys(files).length > 1) {
                return res.status(400).json({
                    code: 400,
                    message: "只能上传一张图片"
                });
            }
            const { product } = fields
            let imageUrl = '/swiper/' + files.imageUrl.newFilename;
            const newSwiper = await swiperModel.create({
                imageUrl,
                product
            })
            res.status(200).json({
                code: 200,
                message: '创建成功',
                data: newSwiper
            });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({
                code: 400,
                message: '创建失败：缺少必要字段或请求不合法',
                data: null
            });
        }
    }
    //读取swiper
    async getSwiper(req, res, next) {
        const data = await swiperModel.find()
        console.log(data);
        if (!data) {
            res.status(500).json({
                code: 500,
                message: '查询失败',
                data: null
            })
        }
        res.status(200).json({
            code: 200,
            message: '查询成功',
            data: data
        })
    }
    //修改轮播图
   async updateSwiper(req, res, next) {
        const form = formidable({
            multiples: true,
            uploadDir: __dirname + '/../../public/swiper',
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
            const { id } = req.params;
            const swiperToUpdate = await swiperModel.findById(id);
            if (!swiperToUpdate) {
                //如果不存在删除上传的图片
                const imagePath = path.resolve(__dirname, `../../public/swiper/${files.imageUrl.newFilename}`);
                await fs.promises.unlink(imagePath);
                return res.status(404).json({
                    code: 404,
                    message: '轮播图不存在',
                });
            }
            // 删除之前的图片
            const previousImageUrl = swiperToUpdate.imageUrl;
            // console.log(previousImageUrl);
            if (previousImageUrl) {
                const imagePath = path.join(__dirname, '/../../public', previousImageUrl);
                try {
                    await fs.promises.unlink(imagePath);
                    console.log('删除失败:', imagePath);
                } catch (error) {
                    console.error('Error removing file:', error);
                }
            }
            let imageUrl = '/swiper/' + files.imageUrl.newFilename;
            const updatedSwiper = await swiperModel.findByIdAndUpdate(id, { ...req.body, imageUrl, updatedAt: Date.now() }, { new: true })
            return res.status(200).json({
                code: 200,
                message: '修改成功',
                data: updatedSwiper,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                code: 500,
                message: '修改轮播图出错',
                error: error.message,
            });
        }
    }
    //删除轮播图
    delectSwiper= async (req,res,next)=>{
        const id = req.params.id;
        console.log("轮播图id",id);
        try {
            const swiper = await swiperModel.findOne({ _id: id });
           
            if (!swiper) {
                return res.status(404).json({
                    code: 404,
                    message: '轮播图不存在',
                });
            }

            const result = await swiperModel.deleteOne({ _id: id });
            //删除图片
            const imageUrl = path.resolve(__dirname, `../../public${swiper.imageUrl}`);
            await fs.promises.unlink(imageUrl);
          

            return res.status(200).json({
                code: 200,
                message: '删除成功',
                data: result,
            });
        } catch (error) {
            return res.status(500).json({
                code: 500,
                message: '删除轮播图出错',
                error: error.message,
            });
        }
   } 
}
module.exports = new swiperCotroller()