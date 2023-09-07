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
    tags = [],
    themes = [],
    genres = [],
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

      if (Array.isArray(themes) && themes.length > 0) {
        query.where("gameTheme").all(themes);
      }

      if (Array.isArray(genres) && genres.length > 0) {
        query.where("gameGenre").all(genres);
      }

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
      if (Array.isArray(themes) && themes.length > 0) {
        countQuery.where("gameTheme").all(themes);
      }
      if (Array.isArray(genres) && genres.length > 0) {
        countQuery.where("gameGenre").all(genres);
      }
      if (Array.isArray(tags) && tags.length > 0) {
        countQuery.where("category").all(tags);
      }
      countQuery.where('price').gte(priceFilter['$gte']).lte(priceFilter['$lte']);
      const totalProducts = await countQuery.countDocuments();
      
      const productsAllQuery = ProductModel.find();
      if (Array.isArray(themes) && themes.length > 0) {
        productsAllQuery.where("gameTheme").all(themes);
      }
      if (Array.isArray(genres) && genres.length > 0) {
        productsAllQuery.where("gameGenre").all(genres);
      }
      if (Array.isArray(tags) && tags.length > 0) {
        productsAllQuery.where("category").all(tags);
      }
      productsAllQuery.where('price').gte(minPrice).lte(maxPrice);
      const productsAll = await productsAllQuery.exec();

      const uniqueThemes = Array.from(new Set(productsAll.flatMap((product) => product.gameTheme))).sort();
      const uniqueGenres = Array.from(new Set(productsAll.flatMap((product) => product.gameGenre))).sort();
      const uniqueTags = Array.from(new Set(productsAll.flatMap((product) => product.category))).sort();

      const filters = {
        themes: uniqueThemes,
        genres: uniqueGenres,
        tags: uniqueTags,
      }

      return {
        products,
        filters,
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

  async getTopFirstGenres() {
    const products = await ProductModel.find();

    const firstGenreCounts = {};
    for (const item of products) {
      const firstGenre = item.gameGenre[0];
      firstGenreCounts[firstGenre] = (firstGenreCounts[firstGenre] || 0) + 1;
    }
  
    const genreArray = Object.keys(firstGenreCounts).map((genre) => ({
      name: genre,
      count: firstGenreCounts[genre],
    }));
  
    genreArray.sort((a, b) => b.count - a.count);
    const topFirstGenres = genreArray.slice(0, 8).map((genre) => genre.name);
    return topFirstGenres;
  }

  async getTopFirstThemes() {
    const products = await ProductModel.find();

    const firstThemeCounts = {};
    for (const item of products) {
      const firstTheme = item.gameTheme[0];
      firstThemeCounts[firstTheme] = (firstThemeCounts[firstTheme] || 0) + 1;
    }

    const themeArray = Object.keys(firstThemeCounts).map((theme) => ({
      name: theme,
      count: firstThemeCounts[theme],
    }));

    themeArray.sort((a, b) => b.count - a.count);
    const topFirstThemes = themeArray.slice(0, 8).map((theme) => theme.name);
    return topFirstThemes;
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
