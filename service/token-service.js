const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model");
const userModel = require("../models/user-model");

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
    return {
      accessToken,
      refreshToken,
    }
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null
    }
  }

  async saveToken(userId, refreshToken) {
    // todo Спросить про авторизацию - если будет только один токен для пользователя - это ок или не ок?
    const tokenData = await tokenModel.findOne({user: userId});
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({user: userId, refreshToken});
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = tokenModel.deleteOne({refreshToken});
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = tokenModel.findOne({refreshToken});
    return tokenData;
  }
}

module.exports = new TokenService();