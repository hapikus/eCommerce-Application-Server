const { Schema, model } = require("mongoose");

const ShippingAddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
});

module.exports = model('ShippingAddress', ShippingAddressSchema);
