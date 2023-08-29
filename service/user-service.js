const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mongoose = require("mongoose");

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
    const users = await UserModel.find();
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

  async updateUser(updatedProfileData) {
    const { id, ...updateData } = updatedProfileData;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }
    const userData = await UserModel.findOne({ _id: id });
    if (!userData) {
      throw new Error('User not found');
    }

    const user = await UserModel.findById(id);
    if (updateData.firstName) {
      user.firstName = updatedProfileData.firstName;
    }
    if (updateData.lastName) {
      user.lastName = updatedProfileData.lastName;
    }
    if (updatedProfileData.password) {
      const hashedPassword = await bcrypt.hash(updatedProfileData.password, 3);
      user.password = hashedPassword;
    }
    await user.save();
    return {user};
  }

  async getShippingAddresses(shippingAddressIds) {
    for (const id of shippingAddressIds) {
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid shipping address ID');
        }
        const shipAddressData = await ShippingAddressModel.findOne({ _id: id });
        if (!shipAddressData) {
          throw new Error('Invalid shipping address data');
        }
      } catch (error) {
        throw ApiError.BadRequest(error.message);
      } 
    }

    const shippingAddresses = await ShippingAddressModel.find({ _id: { $in: shippingAddressIds } });
    if (!shippingAddresses) {
      throw ApiError.BadRequest(`Incorrect shipping data`);
    }
    return shippingAddresses;
  }

  async getBillingAddresses(billingAddressIds) {
    for (const id of billingAddressIds) {
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid billing address ID');
        }
        const billAddressData = await BillingAddressModel.findOne({ _id: id });
        if (!billAddressData) {
          throw new Error('Invalid billing address data');
        }
      } catch (error) {
        throw ApiError.BadRequest(error.message);
      } 
    }

    const billingAddresses = await BillingAddressModel.find({ _id: { $in: billingAddressIds } });
    if (!billingAddresses) {
      throw ApiError.BadRequest(`Incorrect billing data`);
    }
    return billingAddresses;
  }

  async updateShippingAddresses(shippingAddresses) {
    for (const address of shippingAddresses) {
      const { id } = address;
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid shipping address ID');
        }
        const shipAddressData = await ShippingAddressModel.findOne({ _id: id });
        if (!shipAddressData) {
          throw new Error('Invalid shipping address data');
        }
      } catch (error) {
        throw ApiError.BadRequest(error.message);
      } 
    }

    const updatedShippingAddresses = await Promise.all(
      shippingAddresses.map(async (addressUpdate) => {
        const { id, ...updateData } = addressUpdate;
        const updatedShippingAddress = await ShippingAddressModel.findByIdAndUpdate(
          id,
          updateData,
          { new: true }
        );
        return updatedShippingAddress;
      })
    );
    return updatedShippingAddresses
  }

  async updateBillingAddresses(billingAddresses) {
    for (const address of billingAddresses) {
      const { id } = address;
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid billing address ID');
        }
        const billAddressData = await BillingAddressModel.findOne({ _id: id });
        if (!billAddressData) {
          throw new Error('Invalid billing address data');
        }
      } catch (error) {
        throw ApiError.BadRequest(error.message);
      } 
    }

    const updatedBillingAddresses = await Promise.all(
      billingAddresses.map(async (addressUpdate) => {
        const { id, ...updateData } = addressUpdate;
        const updatedBillingAddress = await BillingAddressModel.findByIdAndUpdate(
          id,
          updateData,
          { new: true } // return the updated document after the changes have been applied
        );
        return updatedBillingAddress;
      })
    );
    return updatedBillingAddresses
  }

  async deleteAddress(addressId) {

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      throw ApiError.BadRequest('Invalid address ID');
    }

    const billCheck = await BillingAddressModel.findOne({ _id: addressId });
    const shipCheck = await ShippingAddressModel.findOne({ _id: addressId });

    if (!billCheck && !shipCheck) {
      throw ApiError.BadRequest('Address not found');
    }

    const billAddressData = await BillingAddressModel.findById(addressId);
    const shipAddressData = await ShippingAddressModel.findById(addressId);

    const users = await UserModel.find({
      $or: [
        { billingAddress: addressId },
        { shippingAddress: addressId },
      ],
    });

    for (const user of users) {
      user.billingAddress = user.billingAddress.filter(id => id.toString() !== addressId);
      user.shippingAddress = user.shippingAddress.filter(id => id.toString() !== addressId);
      await user.save();
    }

    if (billCheck) {
      await BillingAddressModel.deleteOne({ _id: addressId });
    }
    if (shipCheck) {
      await ShippingAddressModel.deleteOne({ _id: addressId });
    }

    return {success: true, message: 'Address deleted successfully'};
  }
}

module.exports = new UserService();
