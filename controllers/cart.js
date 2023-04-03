

class cartController {
    createCart = async (req, res) => {
        try {
            const { user } = req.body;
            const cart = new Cart({ user });
            const result = await cart.save();
            res.status(201).json({
                code: 201,
                message: '购物车创建成功',
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error.message || '购物车创建失败',
                data: null,
            });
        }
    };
    getAllCarts = async (req, res) => {
        try {
            const carts = await Cart.find();
            res.status(200).json({
                code: 200,
                message: '查询成功',
                data: carts,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error.message || '查询失败',
                data: null,
            });
        }
    };
    getCartById = async (req, res) => {
        try {
            const { id } = req.params;
            const cart = await Cart.findById(id);
            if (!cart) {
                return res.status(404).json({
                    code: 404,
                    message: '购物车不存在',
                    data: null,
                });
            }
            res.status(200).json({
                code: 200,
                message: '查询成功',
                data: cart,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error.message || '查询失败',
                data: null,
            });
        }
    };
    updateCartById = async (req, res) => {
        try {
            const { id } = req.params;
            const { user, products } = req.body;
            const cart = await Cart.findByIdAndUpdate(
                id,
                { user, products, updatedAt: Date.now() },
                { new: true }
            );
            if (!cart) {
                return res.status(404).json({
                    code: 404,
                    message: '购物车不存在',
                    data: null,
                });
            }
            res.status(200).json({
                code: 200,
                message: '购物车更新成功',
                data: cart,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error.message || '购物车更新失败',
                data: null,
            });
        }
    };
    deleteCartById = async (req, res) => {
        try {
            const { id } = req.params;
            const cart = await Cart.findByIdAndDelete(id);
            if (!cart) {
                return res.status(404).json({
                    code: 404,
                    message: '购物车不存在',
                    data: null,
                });
            }
            res.status(200).json({
                code: 200,
                message: '购物车删除成功',
                data: cart,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: error.message || '购物车删除失败',
                data: null
            })
        }
    }
}