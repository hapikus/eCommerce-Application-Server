const { Schema, model } = require("mongoose");

const SubSkillsSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = model("SubSkill", SubSkillsSchema);