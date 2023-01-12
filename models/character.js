const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
  first_name: {type: String},
  last_name: {type: String},
  gender: {type: String, required: true},
  age: {type: Number, required: true},
  about: {type: String}
})

CharacterSchema.virtual("name").get(function() {
  if (!this.first_name)
    return this.last_name;
  if (!this.last_name)
    return this.first_name;
  return this.first_name + " " + this.last_name;
})

CharacterSchema.virtual("url").get(function() {
  return "/character/${this._id}";
})

module.exports = mongoose.model("Character", CharacterSchema);