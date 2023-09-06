const ApiError = require('../exceptions/api-error');
const productService = require('../service/product-service');

class ProductController {
  async getProduct(req, res, next) {
    try {
      const { title } = req.params;
      const product = await productService.getProduct(title);
      if (!product) {
        return next(ApiError.BadRequest('Product not found'));
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
        return next(ApiError.BadRequest('No random products found'));
      }
      return res.json(productsRandom);
    } catch (e) {
      next(e);
    }
  }

  async getRandProductsWithDiscount(req, res, next) {
    try {
      const { num } = req.query;
      const productsRanDiscount = await productService.getRandomProductsWithDiscount(Number(num));
      if (!productsRanDiscount || productsRanDiscount.length === 0) {
        return next(ApiError.BadRequest('No random products with discount found'));
      }
      return res.json(productsRanDiscount);
    } catch (e) {
      next(e);
    }
  }

  async getCatalogProducts(req, res, next) {
    try {
      const {
        pageNumber,
        pageLimit,
        sortColumn,
        sortDirection,
        tags = [],
        themes = [],
        genres = [],
        minPrice,
        maxPrice
      } = req.body;
      const productsCatalog = await productService.getProductsCatalog(
        pageNumber, 
        pageLimit, 
        sortColumn, 
        sortDirection,
        tags,
        themes,
        genres,
        minPrice,
        maxPrice,
      );
      if (!productsCatalog) {
        return next(ApiError.BadRequest('No products found'));
      }
      return res.json(productsCatalog);
    } catch (e) {
      next(e);
    }
  }
  
  async getAllCategories(_req, res, next) {
    try {
      const uniqueCategories = await productService.getAllCategories();
      if (!uniqueCategories) {
        return next(ApiError.BadRequest('No categories found'));
      }
      return res.json(uniqueCategories);
    } catch (e) {
      next(e);
    }
  }

  async getTopCategories(_req, res, next) {
    try {
      const topCategories = await productService.getTopCategories();
      if (!topCategories) {
        return next(ApiError.BadRequest('No top categories found'));
      }
      return res.json(topCategories);
    } catch (e) {
      next(e);
    }
  }

  async getTopFirstGenres(_req, res, next) {
    try {
      const topGenres = await productService.getTopFirstGenres();
      if (!topGenres) {
        return next(ApiError.BadRequest('No top first genres found'));
      }
      return res.json(topGenres);
    } catch (e) {
      next(e);
    }
  }

  async getTopFirstThemes(_req, res, next) {
    try {
      const topThemes = await productService.getTopFirstThemes();
      if (!topThemes) {
        return next(ApiError.BadRequest('No top first themes found'));
      }
      return res.json(topThemes);
    } catch (e) {
      next(e);
    }
  }

  async searchProducts(req, res, next) {
    try {
      const { query } = req.query;
      if (!query) {
        return next(ApiError.BadRequest('Invalid search query'));
      }  
      const searchResults = await productService.searchGameTitles(query);  
      if (!searchResults || searchResults.length === 0) {
        return next(ApiError.BadReques('No matching game titles found'));
      }  
      return res.json(searchResults);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProductController();