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
      const productsRandom = await productService.getRandomProducts(Number(num));
      if (!productsRandom) {
        return next(ApiError.NotFound('No random products found'));
      }
      return res.json(productsRandom);
    } catch (e) {
      next(e);
    }
  }

  async getCatalogProducts(req, res, next) {
    try {
      const { pageNumber, pageLimit, sortColumn, sortDirection, tags } = req.body;
      const productsCatalog = await productService.getProductsCatalog(
        pageNumber, 
        pageLimit, 
        sortColumn, 
        sortDirection,
        tags,
      );
      if (!productsCatalog) {
        return next(ApiError.NotFound('No products found'));
      }
      return res.json(productsCatalog);
    } catch (e) {
      next(e);
    }
  }
  
  async getAllCategories(_req, res, next) {
    try {
      const uniqueCategories = await productService.getAllCategories();
      return res.json(uniqueCategories);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProductController();