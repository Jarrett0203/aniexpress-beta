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
  body("english").trim().escape(),
  body("native").trim().escape(),
  body("summary").trim().escape(),
  body("format").trim().escape(),
  body("episodes").trim().escape(),
  body("status").trim().escape(),
  body("start_date", "Invalid start date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("end_date", "Invalid end date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

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
      format: req.body.format == "" ? "Unknown" : req.body.format,
      episodes: req.body.episodes,
      status: req.body.status,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
    });

    anime.save(function (err) {
      if (err) {
        return next(err);
      }

      res.redirect(anime.url);
    });
  },
]);

//GET request for one anime.
router.get("/:id", (req, res, next) => {
  Anime.findById(req.params.id).exec(function (err, anime) {
    if (err) {
      return next(err);
    }

    if (anime == null) {
      const err = new Error("Anime not found");
      err.status = 404;
      return next(err);
    }

    res.render("anime/anime_detail", {
      title: anime.romaji,
      anime,
    });
  });
});

module.exports = router;
