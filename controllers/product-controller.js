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

  async getRandProducts(req, res, next) {
    try {
      const { num } = req.query;
      const products = await productService.getRandomProducts(Number(num));
      if (!products) {
        return next(ApiError.NotFound('No random products found'));
      }
      return res.json(products);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProductController();