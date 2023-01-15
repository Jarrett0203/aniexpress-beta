const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AnimeSchema = new Schema({
  romaji: {type: String, required: true, maxLength: 255},
  english: {type: String},
  native: {type: String},
  summary: {type: String},
  format: {type: String},
  episodes: {type: Number},
  status: {type: String},
  start_date: {type: Date},
  end_date: {type: Date},
  season: {type: String}
})

AnimeSchema.virtual("url").get(function() {
  return `/anime/${this._id}`;
})

module.exports = mongoose.model("Anime", AnimeSchema);