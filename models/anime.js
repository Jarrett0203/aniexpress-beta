const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AnimeSchema = new Schema({
  romaji: { type: String, required: true, maxLength: 255 },
  english: { type: String },
  native: { type: String },
  summary: { type: String },
  format: { type: String },
  episodes: { type: Number },
  status: { type: String },
  start_date: { type: Date },
  end_date: { type: Date },
  season: { type: String },
});

AnimeSchema.virtual("url").get(function () {
  return `/anime/${this._id}`;
});

AnimeSchema.virtual("start_date_formatted").get(function () {
  return this.start_date
    ? this.start_date.toLocaleDateString(DateTime.DATE_MED)
    : "";
});
AnimeSchema.virtual("end_date_formatted").get(function () {
  return this.end_date
    ? this.end_date.toLocaleDateString(DateTime.DATE_MED)
    : "";
});

module.exports = mongoose.model("Anime", AnimeSchema);
