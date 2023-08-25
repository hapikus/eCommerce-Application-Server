const bcrypt = require("bcrypt");
const uuid = require("uuid");

const UserModel = require('../models/user-model');
const BillingAddressModel = require('../models/address/billing-model');
const ShippingAddressModel = require('../models/address/shipping-model');
const mailService = require('./mail-service');
const tokenService = require("../service/token-service");
const UserDto = require("../dtos/user-dto");

const ApiError = require("../exceptions/api-error");

class UserService {
  async registration(reqBody) {
    console.log("🚀 ~ file: user-service.js:19 ~ UserService ~ registration ~ reqBody:", reqBody)
    const {
      firstName,
      lastName,
      email,
      dob,
      password,

      defaultShippingCheck,
      shipCountry,
      shipCity,
      shipStreet,
      shipPostalCode,

      defaultBillingCkeck,
      billCountry,
      billCity,
      billStreet,
      billPostalCode,
    } = reqBody;
    const candidate = await UserModel.findOne({email});
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым ящиком ${email} уже существует`);
    }
    const bashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
    const shippingAddress = await ShippingAddressModel.create({
      country: shipCountry,
      city: shipCity,
      street: shipStreet,
      postalCode: shipPostalCode,
      isDefault: defaultShippingCheck,
    })

    const billingAddress = await BillingAddressModel.create({
      country: billCountry || shipCountry,
      city: billCity || shipCity,
      street: billStreet || shipStreet,
      postalCode: billPostalCode || shipPostalCode,
      isDefault: defaultBillingCkeck,
    })

    const user = await UserModel.create({
      email, 
      password: bashPassword, 
      firstName, 
      lastName, 
      activationLink,
      billingAddress: [billingAddress._id],
      shippingAddress: [shippingAddress._id],
      birthday: dob,
    });
    
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
      throw ApiError.BadRequest(`Пользователя не существует`);
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
    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {...tokens, user: userDto};
  }

  async getAllusers() {
    const users = await userModel.find();
    return users;
  }

  async getUser(refreshToken) {
    const userTokenData = tokenService.validateRefreshToken(refreshToken);
    if (userTokenData) {
      const { email } = userTokenData
      return await UserModel.findOne({email});
    }
    return {};
  }
}

module.exports = new UserService();
