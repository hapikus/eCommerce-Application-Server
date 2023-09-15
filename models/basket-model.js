const { Schema, model, MongooseMap } = require("mongoose");

const basketSchema = new Schema({
  basketId: {
    type: String,
    unique: true,
  },
  items: {
    type: Map,
    of: Number,
    default: {},
  },  
  promo: { type: String, default: '' },
});

module.exports = model('Basket', basketSchema);
