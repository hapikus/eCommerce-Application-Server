const BasketModel = require('../models/basket-model');
const ApiError = require("../exceptions/api-error");
const PROMO_CODES = process.env.PROMO_CODES;

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

    for (const [gameTitle, quantity] of anonBasket.items.entries()) {
      if (userBasket.items.has(gameTitle)) {
        userBasket.items.set(gameTitle, userBasket.items.get(gameTitle) + quantity);
        continue;
      }
      userBasket.items.set(gameTitle, quantity);
    }
    
    await userBasket.save();
    await BasketModel.findOneAndDelete({ basketId: basketAnonId });
    return basketUserId;
  }

  async getBasket(basketId) {
    const basket = await BasketModel.findOne({ basketId }, { _id: 0 });
    if (!basket) {
      throw ApiError.BadRequest(`${basketId} basket not found`);
    }
    return basket;
  }

  async clearBasket(basketId) {
    const basket = await BasketModel.findOne({ basketId });
    if (!basket) {
      throw ApiError.BadRequest(`${basketId} basket not found`);
    }
    basket.items = [];
    basket.promo = '';
    await basket.save();
    return basketId;
  }
  
  async addItem(basketId, gameTitle) {
    const basket = await BasketModel.findOne({ basketId });
    if (!basket) {
      throw ApiError.BadRequest(`${basketId} basket not found`);
    }
    if (basket.items && basket.items.has(gameTitle)) {
      throw ApiError.BadRequest(`${gameTitle} already exists in the basket!`);
    }
    basket.items.set(gameTitle, 1);
    await basket.save();
    return basketId;
  }

  async changeQuantity(basketId, itemUpdates) {
    const basket = await BasketModel.findOne({ basketId });
    if (!basket) {
      throw ApiError.BadRequest(`${basketId} basket not found`);
    }
    for (const gameTitle in itemUpdates) {
      const newQuantity = itemUpdates[gameTitle];
      if (newQuantity < 0) {
        throw ApiError.BadRequest(`Incorrect new quantity`);
      }
      if (!basket.items.has(gameTitle)) {
        throw ApiError.BadRequest(`${gameTitle} not found in the basket`);
      }
      basket.items.set(gameTitle, newQuantity);
    }
    await basket.save();
    return basketId;
  }

  async removeItem(basketId, gameTitle) {
    const basket = await BasketModel.findOne({ basketId });
    if (!basket) {
      throw ApiError.BadRequest(`${basketId} basket not found`);
    }
    if (!basket.items.has(gameTitle)) {
      throw ApiError.BadRequest(`${gameTitle} not found in the basket`);
    }
    basket.items.delete(gameTitle);
    await basket.save();
    return basketId;
  }

  async addPromo(basketId, promo) {
    const basket = await BasketModel.findOne({ basketId });
    if (!basket) {
      throw ApiError.BadRequest(`${basketId} basket not found`);
    }
    const isPromoValid = PROMO_CODES.includes(promo);
    if (!isPromoValid) {
      throw ApiError.BadRequest(`Promo ${promo} is not found`);
    }
    basket.promo = promo;
    await basket.save();
    return basketId;
  }

  async deletePromo(basketId) {
    const basket = await BasketModel.findOne({ basketId });
    if (!basket) {
      throw ApiError.BadRequest(`${basketId} basket not found`);
    }
    basket.promo = '';
    await basket.save();
    return basket;
  }
}

module.exports = new ProductService();