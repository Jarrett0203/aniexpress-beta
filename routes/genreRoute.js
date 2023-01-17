const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Genre = require("../models/genre");

//GET request for genre list
router.get("/", (req, res, next) => {
  Genre.find()
    .sort([["genre", "ascending"]])
    .exec(function (err, genre_list) {
      if (err) {
        return next(err);
      }

      res.render("genre/genre_list", {
        title: "Genre List",
        genre_list,
      });
    });
});

//GET request for genre create
router.get("/new", (req, res, next) => {
  res.render("genre/genre_form", { title: "Add Genre" });
});

//POST request for genre create
router.post("/new", [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Genre must be specified"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("genre/genre_form", {
        title: "Add Genre",
        genre: req.body,
        errors: errors.array(),
      });
      return;
    }
    const genre = new Genre({
      name: req.body.name,
    });

    genre.save(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect(genre.url);
    });
  },
]);

module.exports = router;
