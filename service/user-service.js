const bcrypt = require("bcrypt");
const uuid = require("uuid");

const UserModel = require('../models/user-model');
const mailService = require('./mail-service');
const tokenService = require("../service/token-service");
const UserDto = require("../dtos/user-dto");

const ApiError = require("../exceptions/api-error");
const userModel = require("../models/user-model");

class UserService {
  async registration(email, password, firstName, lastName) {
    const candidate = await UserModel.findOne({email});
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым ящиком ${email} уже существует`);
    }
    const bashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
    const user = await UserModel.create({email, password: bashPassword, firstName, lastName, activationLink});
    
    const userDto = new UserDto(user) 
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }

  async activate(activationLink) {
    // todo Добавить проверку, что пользователь уже активирован
    const user = await UserModel.findOne({activationLink});
    if (!user) {
      throw ApiError.BadRequest(`Некорректная ссылка активации`);
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({email});
    if (!user) {
      throw ApiError.BadRequest(`Пользователь с почтовым ящиком ${email} не существует`);
    }
    const isPasswordEquels = await bcrypt.compare(password, user.password);
    if (!isPasswordEquels) {
      throw ApiError.BadRequest(`Неверный пароль`);
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {...tokens, user: userDto};
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnaucthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnaucthorizedError();
    }
    const user = await userModel.findById(userData.id)
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {...tokens, user: userDto};
  }

  async getAllusers() {
    const users = await userModel.find();
    return users;
  }
}

module.exports = new UserService();
