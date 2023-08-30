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

  async getProductsCatalog(pageNumber, pageLimit, sortColumn, sortDirection) {
    const validSortColumns = ['gameTitle', 'price', 'devCompany'];
    if (!validSortColumns.includes(sortColumn)) {
      throw ApiError.BadRequest('Invalid sort_column');
    }

    const validSortDirections = ['up', 'down'];
    if (!validSortDirections.includes(sortDirection)) {
      throw new Error('Invalid sort_direction');
    }

    const skip = (pageNumber - 1) * pageLimit;
    const limit = pageLimit;

    try {
      const query = ProductModel.find();
    
      if (sortColumn === 'gameTitle') {
        query.sort({ gameTitle: sortDirection === 'up' ? 1 : -1 });
      } 
      if (sortColumn === 'price') {
        query.sort({ price: sortDirection === 'up' ? 1 : -1 });
      } 
      if (sortColumn === 'devCompany') {
        query.sort({ devCompany: sortDirection === 'up' ? 1 : -1 });
      }
    
      query.skip(skip).limit(limit);
    
      const products = await query.exec();
      const totalProducts = await ProductModel.countDocuments();
    
      return {
        products,
        totalProducts,
      };
    } catch (error) {
      throw new Error('Error fetching products from the catalog');
    }
  }
}

module.exports = new ProductService();
