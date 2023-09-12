const BasketModel = require('../models/basket-model');
const ApiError = require("../exceptions/api-error");

const tokenService = require("../service/token-service");
const UserModel = require('../models/user-model');
const uuid = require('uuid');

function generateUUIDWithoutHyphens() {
  const rawUUID = uuid.v4();
  return rawUUID.replace(/-/g, '');
}

class ProductService {
  async create() {
    const basketId = generateUUIDWithoutHyphens();
    const newBasket = new BasketModel({ basketId });
    await newBasket.save();
    if (!newBasket) {
      throw ApiError.BadRequest(`Error in create proccess`);
    }
    return basketId;
  }

  async addToUser(basketId, refreshToken) {
    const userTokenData = tokenService.validateRefreshToken(refreshToken);
    if (!userTokenData) {
      throw ApiError.UnaucthorizedError();
    }

    const { email } = userTokenData;
    const user = await UserModel.findOne({ email });
    if (user.basketId && user.basketId !== null) {
      throw ApiError.BadRequest('User already has a basket.');
    }

    user.basketId = basketId;
    await user.save();

    return basketId;
  }

  async mergeBaskets(basketAnonId, basketUserId) {
    const anonBasket = await BasketModel.findOne({ basketId: basketAnonId });
    if (!anonBasket) {
      throw ApiError.BadRequest('anonBasket basket not found');
    }    
    const userBasket = await BasketModel.findOne({ basketId: basketUserId });
    if (!userBasket) {
      throw ApiError.BadRequest('userBasket basket not found');
    }

    for (const [gameTitle, quantity] of Object.entries(anonBasket.items)) {
      userBasket.items[gameTitle] = (userBasket.items[gameTitle] || 0) + quantity;
    }
    await userBasket.save();
    await BasketModel.findOneAndDelete({ basketId: basketAnonId });
    return basketUserId;
  }
}

module.exports = new ProductService();