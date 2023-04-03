/*
 * @Author: marineyulxl
 * @Date: 2023-04-03 12:34:39
 * @LastEditTime: 2023-04-03 12:34:43
 */
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
      if (deleteImages && deleteImages.length > 0) {
        await productModel.findByIdAndUpdate(productId, { $pull: { images: { $in: deleteImages } } });
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
  