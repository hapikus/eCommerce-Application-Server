const ApiError = require('../exceptions/api-error');
const basketService = require('../service/basket-service');

class BasketController {
  async create(_req, res, next) {
    try {
      const neBasketID = await basketService.create();
      if (!neBasketID) {
        return next(ApiError.BadRequest('Error in basket creating process'));
      }
      return res.json(neBasketID);
    } catch (e) {
      next(e);
    }
  };

  async addToUser(req, res, next) {
    try {
      const { basketId } = req.body;
      const { refreshToken } = req.cookies;
      const userBaskedId = await basketService.addToUser(basketId, refreshToken);
      if (!userBaskedId) {
        return next(ApiError.BadRequest('Error in add-to-user process'));
      }
      return res.json(userBaskedId);
    } catch (e) {
      next(e);
    }
  };

  async mergeBaskets(req, res, next) {
    try {
      const { basketAnonId, basketUserId } = req.body;
      const mergedBasket = await basketService.mergeBaskets(basketAnonId, basketUserId);
      if (!mergedBasket) {
        return next(ApiError.BadRequest(`Error in mergeBaskets: ${basketAnonId} and ${basketUserId}`));
      }
      return res.json(mergedBasket);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new BasketController();