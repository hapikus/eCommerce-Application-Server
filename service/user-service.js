const bcrypt = require("bcrypt");
const uuid = require("uuid");

const UserModel = require('../models/user-model');
const mailService = require('./mail-service');
const tokenService = require("../service/token-service");
const UserDto = require("../dtos/user-dto");

class UserService {
  async registration(email, password, firstName, lastName) {
    const candidate = await UserModel.findOne({email});
    if (candidate) {
      throw new Error(`Пользователь с почтовым ящиком ${email} уже существует`);
    }
    const bashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await UserModel.create({email, password: bashPassword, firstName, lastName, activationLink});
    await mailService.sendActivationMail(email, activationLink);

    const userDto = new UserDto(user) 
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    tokens.accessToken
    return {...tokens, user: userDto};
  }
}

module.exports = new UserService();
