const { Schema, model } = require("mongoose");

const OrderSchema = new Schema({
  orderNumber: { type: String, required: true },
  products: [{type: Schema.Types.ObjectId, ref: 'Product'}],
});

module.exports = model("Order", OrderSchema);
