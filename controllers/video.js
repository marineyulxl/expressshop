/*
 * @Author: marineyulxl
 * @Date: 2023-04-16 16:40:02
 * @LastEditTime: 2023-04-22 13:44:41
 */
const videoModel = require('../models/video');
const fs = require('fs');
const path = require('path');
const util = require('util');
const formidable = require('formidable');
const { model } = require('mongoose');

class VideoController {
  // Create video
  async createVideo(req, res, next) {
    const form = formidable({
      multiples: true,
      uploadDir: __dirname + '/../public/videos',
      keepExtensions: true,
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

      // Check that videoUrl exists
      if (!files.videoUrl) {
        return res.status(400).json({
          code: 400,
          message: '缺少必要字段：videoUrl',
        });
      }
      if (Object.keys(files).length > 1) {
        const videoPath = path.resolve(__dirname, `../../public/videos/${files.videoUrl.newFilename}`);
        await fs.promises.unlink(videoPath);
        return res.status(400).json({
          code: 400,
          message: '只能上传一个视频文件',
        });
      }
        
      const { videoUrl } = files;
      let url = '/videos/' + videoUrl.newFilename;

      const prevVideo = await videoModel.findOne({});
      if (prevVideo) {
        const prevVideoPath = path.resolve(__dirname, `../public/${prevVideo.videoUrl}`);
        await fs.promises.unlink(prevVideoPath);
        await videoModel.findOneAndDelete({ _id: prevVideo._id });
      }
      // Create new video
      const newVideo = await videoModel.create({ videoUrl:url });
      res.status(200).json({
        code: 200,
        message: '创建成功',
        data: newVideo,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        code: 400,
        message: '创建失败：缺少必要字段或请求不合法',
        data: null,
      });
    }
  }

  // Read video
  async getVideo(req, res, next) {
    const data = await videoModel.findOne({});
    console.log(data);
    if (!data) {
      res.status(500).json({
        code: 500,
        message: '获取视频失败',
        data: null,
      });
    }
    res.status(200).json({
      code: 200,
      message: '获取视频成功',
      data: data,
    });
  }

}
module.exports =new VideoController()