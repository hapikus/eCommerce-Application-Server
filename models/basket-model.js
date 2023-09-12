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
  promo: { type: String },
});

module.exports = model('Basket', basketSchema);
