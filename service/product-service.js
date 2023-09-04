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
      throw ApiError.BadRequest("No random products found");
    }
    return randomProducts;
  }

  async getRandomProductsWithDiscount(num) {
    const randomProductsWithDiscount = await ProductModel.aggregate([
      {
        $match: {
          discountPrice: { $type: "number" },
        },
      },
      { $sample: { size: num } },
    ]);

    if (
      !randomProductsWithDiscount ||
      randomProductsWithDiscount.length === 0
    ) {
      throw ApiError.BadRequest("No random products with discount found");
    }

    return randomProductsWithDiscount;
  }

  async getProductsCatalog(
    pageNumber,
    pageLimit,
    sortColumn,
    sortDirection,
    tags,
    minPrice = 0,
    maxPrice = Infinity,
  ) {
    const validSortColumns = ["gameTitle", "price", "devCompany"];
    if (!validSortColumns.includes(sortColumn)) {
      throw ApiError.BadRequest("Invalid sort_column");
    }

    const validSortDirections = ["up", "down"];
    if (!validSortDirections.includes(sortDirection)) {
      throw ApiError.BadRequest("Invalid sort_direction");
    }

    const skip = (pageNumber - 1) * pageLimit;
    const limit = pageLimit;

    const priceFilter = {
      '$gte': minPrice,
      '$lte': maxPrice,
    };

    try {
      const query = ProductModel.find();

      if (Array.isArray(tags) && tags.length > 0) {
        query.where("category").all(tags);
      }

      query.where('sortPrice').gte(priceFilter['$gte']).lte(priceFilter['$lte']);

      const sorters = {
        default: () => ({}),
        gameTitle: () => ({ gameTitle: sortDirection === "up" ? 1 : -1 }),
        price: () => ({ price: sortDirection === "up" ? 1 : -1 }),
        devCompany: () => ({ devCompany: sortDirection === "up" ? 1 : -1 }),
      };

      query.sort((sorters[sortColumn] || sorters.default)());
      query.skip(skip).limit(limit);

      const products = await query.exec();

      const countQuery = ProductModel.find();
      if (Array.isArray(tags) && tags.length > 0) {
        countQuery.where("category").all(tags);
      }
      countQuery.where('price').gte(priceFilter['$gte']).lte(priceFilter['$lte']);
      const totalProducts = await countQuery.countDocuments();

      return {
        products,
        totalProducts,
      };
    } catch (error) {
      throw ApiError.BadRequest("Error fetching products from the catalog");
    }
  }

  async getAllCategories() {
    const uniqueCategories = await ProductModel.distinct("category");
    if (!uniqueCategories) {
      throw ApiError.BadRequest("No categories found");
    }
    const sortedCategories = uniqueCategories.filter(
      (category) => !(category.includes("Steam") || category.includes("Valve"))
    );
    return sortedCategories;
  }

  async getTopCategories() {
    const products = await ProductModel.find();

    const categoryCounts = {};
    for (const item of products) {
      for (const category of item.category) {
        if (category.includes('Steam') || category.includes('Valve')) {
          continue;
        }
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    }
  
    const categoryArray = Object.keys(categoryCounts).map((category) => ({
      name: category,
      count: categoryCounts[category],
    }));
  
    categoryArray.sort((a, b) => b.count - a.count);
    const topCategories = categoryArray.slice(0, 8).map((category) => category.name);
    return topCategories;
  }

  async searchGameTitles(query) {
    try {
      const searchResults = await ProductModel.find({
        gameTitle: { $regex: new RegExp(query, 'i') },
      })
        .limit(5)
        .select('headerImg gameTitle price discountPrice');

      return searchResults;
    } catch (error) {
      throw ApiError.BadRequest('Error searching game titles');
    }
  }
}

module.exports = new ProductService();
