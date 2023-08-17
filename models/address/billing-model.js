const { Schema, model } = require("mongoose");

const BillingAddressSchema = new Schema({
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  postalCode: { type: String, required: true },
  isDefault: {type: Boolean, default: false},
});

module.exports = model('BillingAddress', BillingAddressSchema);
