const { Schema, model } = require("mongoose");

const MainSkillsSchema = new Schema({
  name: { type: String, required: true, unique: true },
  subSkills: [{type: Schema.Types.ObjectId, ref: 'SubSkill'}],
});

module.exports = model("MainSkill", MainSkillsSchema);