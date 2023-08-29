const ProductModel = require('../models/product/product-model');
const ApiError = require("../exceptions/api-error");

class ProductService {
  async getProduct(title) {
    const product = await ProductModel.findOne({ gameTitle: title });
    if (!product) {
      throw ApiError.BadRequest(`Product with title "${title}" not found`);
    }
    return product;
  }

  async getRandomProducts(num) {
    const randomProducts = await ProductModel.aggregate([
      { $sample: { size: num } },
    ]);
    if (!randomProducts || randomProducts.length === 0) {
      throw ApiError.BadRequest('No random products found');
    }
    return randomProducts;
  }
}

module.exports = new ProductService();
