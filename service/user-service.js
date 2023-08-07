const bcrypt = require("bcrypt");
const uuid = require("uuid");

const UserModel = require('../models/user-model');
const mailService = require('./mail-service');
const tokenService = require("../service/token-service");
const UserDto = require("../dtos/user-dto");

const ApiError = require("../exceptions/api-error");

class UserService {
  async registration(email, password, firstName, lastName) {
    const candidate = await UserModel.findOne({email});
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым ящиком ${email} уже существует`);
    }
    const bashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    
    const user = await UserModel.create({email, password: bashPassword, firstName, lastName, activationLink});
    
    // await mailService.sendActivationMail(email, activationLink);

    const userDto = new UserDto(user) 
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    // await activate(activationLink);
    return {...tokens, user: userDto};
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({activationLink});
    if (!user) {
      throw ApiError.BadRequest(`Пользователь с ссылкой для активации ${activationLink} уже существует`);
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
}

module.exports = new UserService();
