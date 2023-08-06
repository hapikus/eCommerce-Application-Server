const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  sellingName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // $/h
  mainSkills: [{type: Schema.Types.ObjectId, ref: 'MainSkill'}],
  subSkills: [{type: Schema.Types.ObjectId, ref: 'SubSkill'}],
  imageUrl: { type: String },
});

module.exports = model("Product", ProductSchema);
