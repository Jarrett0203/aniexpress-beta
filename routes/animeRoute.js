const express = require("express");
const router = express.Router();
const async = require("async");
const { body, validationResult } = require("express-validator");
const Anime = require("../models/anime");
const Genre = require("../models/genre");

router.get("/", (req, res, next) => {
  Anime.find()
    .sort([["romaji", "ascending"]])
    .exec(function (err, anime_list) {
      if (err) {
        return next(err);
      }

      res.render("anime/anime_list", {
        title: "Anime List",
        anime_list,
      });
    });
});

//handle anime create on GET.
router.get("/new", (req, res, next) => {
  async.parallel(
    {
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("anime/anime_form", {
        title: "Add Anime",
        genres: results.genres,
      });
    }
  );
});

//handle anime create on POST.
router.post("/new", [
  (req, res, next) => {
    if (!Array.isArray(req.body.genres)) {
      req.body.genres =
        typeof req.body.genres === "undefined" ? [] : [req.body.genres];
    }
    next();
  },

  body("romaji")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Romaji must be specified"),
  body("english").trim().escape(),
  body("native").trim().escape(),
  body("summary").trim(),
  body("format").trim().escape(),
  body("episodes").trim().escape(),
  body("status").trim().escape(),
  body("season").trim().escape(),
  body("genre.*").escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      async.parallel(
        {
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          for (const genre of results.genres) {
            if (anime.genres.includes(genre._id)) genre.checked = "true";
          }

          res.render("anime/anime_form", {
            title: "Add Anime",
            anime: req.body,
            genres: results.genres,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    const anime = new Anime({
      romaji: req.body.romaji,
      english: req.body.english,
      native: req.body.native,
      summary:
        req.body.summary == "" ? "No summary added yet" : req.body.summary,
      format: req.body.format == "" ? "Unknown" : req.body.format,
      episodes: req.body.episodes == "" ? "Unknown" : req.body.episodes,
      status: req.body.status,
      start_date: req.body.start_date == "" ? "Unknown" : req.body.start_date,
      end_date: req.body.end_date == "" ? "Unknown" : req.body.end_date,
      season: req.body.season == "" ? "Unknown" : req.body.season,
      genres: req.body.genres,
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
  Anime.findById(req.params.id)
    .populate("genres")
    .exec(function (err, anime) {
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

//GET request for anime delete.
router.get("/:id/delete", (req, res, next) => {
  Anime.findById(req.params.id).exec(function (err, anime) {
    if (err) {
      return next(err);
    }

    if (anime == null) {
      res.redirect("/anime");
    }

    res.render("anime/anime_delete", {
      title: anime.romaji,
      anime,
    });
  });
});

//POST request for anime delete.
router.post("/:id/delete", (req, res, next) => {
  Anime.findByIdAndRemove(req.params.id, function deleteAnime(err) {
    if (err) {
      return next(err);
    }

    res.redirect("/anime");
  });
});

//GET request for anime update.
router.get("/:id/update", (req, res, next) => {
  async.parallel(
    {
      anime(callback) {
        Anime.findById(req.params.id).populate("genres").exec(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.anime == null) {
        const err = new Error("Anime not found");
        err.status = 404;
        return next(err);
      }

      for (const genre of results.genres) {
        for (const animeGenre of results.anime.genres) {
          if (genre._id.toString() === animeGenre._id.toString())
            genre.checked = true;
        }
      }

      res.render("anime/anime_form", {
        title: "Update Anime",
        anime: results.anime,
        genres: results.genres,
      });
    }
  );
});

//POST request for anime update.
router.post("/:id/update", [
  (req, res, next) => {
    if (!Array.isArray(req.body.genres)) {
      req.body.genres =
        typeof req.body.genres === "undefined" ? [] : [req.body.genres];
    }
    next();
  },

  body("romaji")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Romaji must be specified"),
  body("english").trim().escape(),
  body("native").trim().escape(),
  body("summary").trim(),
  body("format").trim().escape(),
  body("episodes").trim().escape(),
  body("status").trim().escape(),
  body("season").trim().escape(),
  body("genre.*").escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const anime = new Anime({
      romaji: req.body.romaji,
      english: req.body.english,
      native: req.body.native,
      summary:
        req.body.summary == "" ? "No summary added yet" : req.body.summary,
      format: req.body.format == "" ? "Unknown" : req.body.format,
      episodes: req.body.episodes == "" ? "Unknown" : req.body.episodes,
      status: req.body.status,
      start_date: req.body.start_date == "" ? "Unknown" : req.body.start_date,
      end_date: req.body.end_date == "" ? "Unknown" : req.body.end_date,
      season: req.body.season == "" ? "Unknown" : req.body.season,
      genres: req.body.genres,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          anime(callback) {
            Anime.findById(req.params.id).populate("genres").exec(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          for (const genre of results.genres) {
            for (const animeGenre of results.anime.genres) {
              if (genre._id.toString() === animeGenre._id.toString())
                genre.checked = true;
            }
          }

          res.render("anime/anime_form", {
            title: "Update Anime",
            anime: results.anime,
            genres: results.genres,
            errors: errors.array(),
          });
        }
      );
    } else {
      Anime.findByIdAndUpdate(
        req.params.id,
        anime,
        {},
        function (err, theanime) {
          if (err) {
            return next(err);
          }

          res.redirect(theanime.url);
        }
      );
    }
  },
]);

module.exports = router;
