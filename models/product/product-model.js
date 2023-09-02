const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  gameTitle: { type: String, required: true },
  headerImg: { type: String },
  screenshotList: [{ type: String }],
  userReviewRows: [
    {
      ReviewSummary: { type: String },
      ResponsiveHidden: { type: String },
    },
  ],
  price: { type: Number },
  discountPrice: { type: Number },
  releaseDate: { type: String },
  devCompany: { type: String },
  descriptionShort: { type: String },
  descriptionLong: [{ type: String }],
  category: [{ type: String }],
  sysRequirementsMinimum: {
    OS: { type: String },
    Processor: { type: String },
    Memory: { type: String },
    Graphics: { type: String },
    DirectX: { type: String },
    Network: { type: String },
    Storage: { type: String },
    VRSupport: { type: String },
  },
  sysRequirementsMinimumFill: {
    OS: { type: String },
    Processor: { type: String },
    Memory: { type: String },
    Graphics: { type: String },
    DirectX: { type: String },
    Network: { type: String },
    Storage: { type: String },
  },
  sysRequirementsRecommended: {
    OS: { type: String },
    Processor: { type: String },
    Memory: { type: String },
    Graphics: { type: String },
    DirectX: { type: String },
    Network: { type: String },
    Storage: { type: String },
  },
}, { collection: "product" });

module.exports = model("product", ProductSchema);
