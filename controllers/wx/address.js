const addressModel = require('../../models/wx/address')

class AddressController {
  // 创建地址
  // 后端检查并保存默认地址的逻辑
  async createAddress(req, res) {
    const userId = req.user._id; // 获取用户ID
    const { userName, telNumber, provinceName, cityName, countyName, detailInfo,isDefault } = req.body;
    let shouldSetDefault = false;
    if (isDefault !== false) {
      shouldSetDefault = isDefault;
    } else {
      // 检查用户是否已经有地址
      const existingAddress = await addressModel.findOne({ user: userId });
      shouldSetDefault = !existingAddress; // 如果用户没有地址，当前地址就是默认地址
    }
    try {
      // 如果当前地址为默认地址，检查是否已存在默认地址
      if (isDefault) {
        const existingDefaultAddress = await addressModel.findOne({ user: userId, isDefault: true });
        if (existingDefaultAddress) {
          existingDefaultAddress.isDefault = false;
          await existingDefaultAddress.save();
        }
      }
      const createdAddress = await addressModel.create({
        user: userId,
        userName,
        telNumber,
        provinceName,
        cityName,
        countyName,
        detailInfo,
        isDefault:shouldSetDefault
      });

      res.status(200).json({
        code: 200,
        message: '创建成功',
        data: createdAddress
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
  // 查询用户所有地址
  async findAllAddresses(req, res) {
    const userId = req.user._id; // 获取用户ID
    try {
      const addresses = await addressModel.find({ user: userId }); // 查询该用户所有地址
      res.status(200).json({
        code: 200,
        message: '查询成功',
        data: addresses
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

     // 根据id查询地址
     async findAddressById(req, res) {
      const id = req.params.addressId;
      try {
        const address = await addressModel.findById(id);
        if (!address) {
          return res.status(404).json({
            code: 404,
            message: '地址不存在'
          });
        }
        res.status(200).json({
          code: 200,
          message: '查询成功',
          data: address
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          code: 500,
          message: '服务器错误'
        });
      }
    }

  
  // 更新地址
  async updateAddress(req, res) {
    const userId = req.user._id;
    const { addressId: id } = req.params;
    const { userName, telNumber, provinceName, cityName, countyName, detailInfo, isDefault } = req.body;

    try {
      const address = await addressModel.findOne({ user: userId, _id: id });
      if (!address) {
        return res.status(404).json({
          code: 404,
          message: '地址不存在'
        });
      }
      address.userName = userName || address.userName;
      address.telNumber = telNumber || address.telNumber;
      address.provinceName = provinceName || address.provinceName;
      address.cityName = cityName || address.cityName;
      address.countyName = countyName || address.countyName;
      address.detailInfo = detailInfo || address.detailInfo;
      // 如果是修改成默认地址，则需要将原来的默认地址改为非默认
      if (isDefault) {
        const existingDefaultAddress = await addressModel.findOne({ user: userId, isDefault: true });
        if (existingDefaultAddress && existingDefaultAddress.id !== address.id) {
          existingDefaultAddress.isDefault = false;
          await existingDefaultAddress.save();
        }
      }
      address.updatedAt = Date.now(); // 更新时间戳
      address.isDefault = isDefault;
      await address.save();

      res.status(200).json({
        code: 200,
        message: '更新成功',
        data: address
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }

  // 删除地址
  async deleteAddress(req, res) {
    const userId = req.user._id;
    const { addressId: id } = req.params;
  
    try {
      const address = await addressModel.findOne({ user: userId, _id: id });
      if (!address) {
        return res.status(404).json({
          code: 404,
          message: '地址不存在'
        });
      }
  
      await addressModel.deleteOne({ user: userId, _id: id });
  
      res.status(200).json({
        code: 200,
        message: '删除成功'
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    }
  }
  
  

}
module.exports = new AddressController()