const express = require("express");
const router = express.Router();
const Anime = require("../models/anime");
const { body, validationResult } = require("express-validator");

router.get("/", (req, res, next) => {
  Anime.find()
    .sort([["romaji", "ascending"]])
    .exec(function (err, anime_list) {
      if (err) {
        return next(err);
      }

      res.render("anime/anime", {
        title: "Anime List",
        anime_list,
      });
    });
});

//handle anime create on GET.
router.get("/new", (req, res, next) => {
  res.render("anime/anime_form", { title: "Add Anime" });
});

//handle anime create on POST.
router.post("/new", [
  body("romaji")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Romaji must be specified"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("anime/anime_form", {
        title: "Add Anime",
        anime: req.body,
        errors: errors.array(),
      });
      return;
    }
    const anime = new Anime({
      romaji: req.body.romaji,
      english: req.body.english,
      native: req.body.native,
      summary: req.body.summary,
      episodes: req.body.episodes,
      status: req.body.status,
      start_date: req.body.start_date,
      end_date: req.body.end_date
    });

    anime.save(function (err) {
      if (err) {
        return next(err);
      }

      res.redirect(anime.url);
    });
  },
]);

module.exports = router;
