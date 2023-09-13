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

  async clearBasket(req, res, next) {
    try {
      const { basketId } = req.params;
      if (!basketId) {
        return next(ApiError.BadRequest('Invalid basketId'));
      }
      const clearBasketResult = await basketService.clearBasket(basketId);
      if (!clearBasketResult) {
        return next(ApiError.BadRequest('Error in clear basket process'));
      }
       return res.json(basketId);
    } catch (e) {
      next(e);
    }
  }

  async addItem(req, res, next) {
    try {
      const { basketId } = req.params;
      const { gameTitle } = req.body;
      if (!basketId || !gameTitle) {
        return next(ApiError.BadRequest('Invalid basketId or gameTitle'));
      }
      const addItemresult = await basketService.addItem(basketId, gameTitle);
      if (!addItemresult) {
        return next(ApiError.BadRequest('Add item in the basket error'));
      }
      return res.json(basketId);
    } catch (e) {
      next(e);
    }
  }

  async changeQuantity(req, res, next) {
    try {
      const { basketId } = req.params;
      const { itemUpdates } = req.body; 
      if (!basketId || !itemUpdates) {
        return next(ApiError.BadRequest('Invalid basketId or itemUpdates'));
      }
      const changeQuantityResult = await basketService.changeQuantity(basketId, itemUpdates);
      if (!changeQuantityResult) {
        return next(ApiError.BadRequest('Change quantity error'));
      }
      return res.json(basketId);
    } catch (e) {
      next(e);
    }
  }

  async removeItem(req, res, next) {
    try {
      const { basketId } = req.params;
      const { gameTitle } = req.body;
      if (!basketId || !gameTitle) {
        return next(ApiError.BadRequest('Invalid basketId or gameTitle'));
      }  
      const removeItemResult = await basketService.removeItem(basketId, gameTitle);
      if (!removeItemResult) {
        return next(ApiError.BadRequest('Add item in the basket error'));
      }
      return res.json(basketId);
    } catch (e) {
      next(e);
    }
  }

  async addPromo(req, res, next) {
    try {
      const { basketId } = req.params;
      const { promo } = req.body;
      if (!basketId || !promo) {
        return next(ApiError.BadRequest('Invalid basketId or promo'));
      }
      const addPromoResult = await basketService.addPromo(basketId, promo);
      if (!addPromoResult) {
        return next(ApiError.BadRequest('Add promo in the basket error'));
      }
      return res.json(basketId);
    } catch (e) {
      next(e);
    }
  }

  async deletePromo(req, res, next) {
    try {
      const { basketId } = req.params;
      if (!basketId) {
        return next(ApiError.BadRequest('Invalid basketId'));
      }
      const deletePromoResult = await basketService.deletePromo(basketId);
      if (!deletePromoResult) {
        return next(ApiError.BadRequest('Delete promo in the basket error'));
      }
      return res.json(basketId);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new BasketController();