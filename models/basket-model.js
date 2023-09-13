const { Schema, model } = require("mongoose");

const basketSchema = new Schema({
  basketId: {
    type: String,
    unique: true,
  },
  items: [
    {
      gameTitle: String,
      quantity: Number,
    },
  ],
  promo: { type: String, default: '' },
});

module.exports = model('Basket', basketSchema);
