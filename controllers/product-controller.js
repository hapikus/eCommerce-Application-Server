const ApiError = require('../exceptions/api-error');
const productService = require('../service/product-service');

class ProductController {
  async getProduct(req, res, next) {
    try {
      const { title } = req.params;
      const product = await productService.getProduct(title);
      if (!product) {
        return next(ApiError.NotFound('Product not found'));
      }
      return res.json(product);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProductController();