const ApiError = require('../exceptions/api-error');
const userService = require('../service/user-service');
const {validationResult} = require("express-validator");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка валидации', errors.array()));
      }
      const userData = await userService.registration(req.body);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка валидации', errors.array()));
      }
      const {email, password} = req.body;
      const userData = await userService.login(email, password)
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.status(200).json(token)
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activateLing = req.params.link;
      await userService.activate(activateLing);
      return res.status(200).json({'message': 'Пользователь успешно активирован'});
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.refresh(refreshToken)
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllusers();
      return res.json(users);
    } catch (e) {
      console.log(e);
    }
  }

  async getUser(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const user = await userService.getUser(refreshToken);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async checkPassword(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const {password} = req.body;
      const checkAnswer = await userService.checkPassword(refreshToken, password);
      if (!checkAnswer) {
        return res.status(400).json({ message: 'Incorrect password' });
      }
      return res.status(200).json({ message: 'Password is correct' });
    } catch (e) {
      next(e)
    }
  }

  async updateUser(req, res, next) {
    try {
      const { updateUserBody } = req.body;
      const userData = await userService.updateUser(updateUserBody);
      return res.json(userData);
    } catch (e) {
      next(e)
    }
  }

  async getShippingAddresses(req, res, next) {
    try {
      const { shippingAddressIds } = req.body;
      const shippingAddresses = await userService.getShippingAddresses(shippingAddressIds);
      return res.json(shippingAddresses);
    } catch (e) {
      next(e);
    }
  }

  async getBillingAddresses(req, res, next) {
    try {
      const { billingAddressIds } = req.body;
      const billingAddresses = await userService.getBillingAddresses(billingAddressIds);
      return res.json(billingAddresses);
    } catch (e) {
      next(e);
    }
  }

  async updateShippingAddresses(req, res, next) {
    try {
      const { shippingAddresses } = req.body
      const updatedShippingAddresses = await userService.updateShippingAddresses(shippingAddresses);
      return res.json(updatedShippingAddresses);
    } catch (e) {
      next(e)
    }
  }

  async updateBillingAddresses(req, res, next) {
    try {
      const { billingAddresses  } = req.body
      const updatedBillingAddresses = await userService.updateBillingAddresses(billingAddresses);
      return res.json(updatedBillingAddresses);
    } catch (e) {
      next(e);
    }
  }

  async deleteAddress(req, res, next) {
    try {
      const addressId = req.params.id;
      const deleteResult = await userService.deleteAddress(addressId);
      return res.json(deleteResult);
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { userId } = req.body;
      const deleteResult = await userService.deleteUser(userId);
      return res.json(deleteResult);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
