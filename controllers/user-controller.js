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
}

module.exports = new UserController();
