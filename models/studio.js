
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudioSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

// Virtual for studio's URL
StudioSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/studio/${this._id}`;
});

module.exports = mongoose.model("Studio", StudioSchema);