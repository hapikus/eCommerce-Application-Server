const BasketModel = require('../models/basket-model');
const ProductModel = require('../models/product/product-model');
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

  async getBasketFull(basketId) {
    const basket = await BasketModel.findOne({ basketId }, { _id: 0 });
    if (!basket) {
      throw ApiError.BadRequest(`${basketId} basket not found`);
    }

    const basketPromos = {
      SAVE10: (price) => {
        return price * 0.9;
      },
      SAVE20: (price) => {
        return price * 0.8;
      },
      "FIRST ORDER": (price) => {
        return price * 0.75
      }
    };
    const itemsDetails = {};
    for (const [gameTitle, quantity] of basket.items.entries()) {
      const game = await ProductModel.findOne({ gameTitle }); 

      let promoPrice = game.sortPrice;
      if (basket.promo && basketPromos.hasOwnProperty(basket.promo)) {
        promoPrice = basketPromos[basket.promo](game.sortPrice)
      }
  
      if (game) {
        itemsDetails[gameTitle] = {
          gameTitle: game.gameTitle,
          headerImg: game.headerImg,
          descriptionShort: game.descriptionShort,
          price: game.price,
          discountPrice: game.discountPrice,
          sortPrice: game.sortPrice,
          promoPrice: Number(promoPrice.toFixed(2)),
          basketQantity: quantity,
        };
      }
    }

    return itemsDetails;
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
    const filteredPromos = PROMO_CODES.slice(1,-1).split(', ').filter(code => code === `"${promo}"`);
    const isPromoValid = filteredPromos.length === 1;
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