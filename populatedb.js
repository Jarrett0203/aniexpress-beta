#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/?retryWrites=true&w=majority"
);

// Get arguments passed on command line
let userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
let async = require("async");
let Anime = require("./models/anime");
let Studio = require("./models/genre");
let Character = require("./models/character");
let Studio = require("./models/studio");
let voiceActor = require("./models/voiceActor");

let mongoose = require("mongoose");
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let animes = [];
let genres = [];
let characters = [];
let studios = [];
let voiceActors = [];

function animeCreate(romaji, english, native, summary, episodes, status, start_date, end_date, season, cb) {
  animedetail = { 
    romaji: romaji,
    status: status
  };
  if (english != false) animedetail.english = english;
  if (native != false) animedetail.native = native;
  if (summary != false) animedetail.summary = summary;
  if (episodes != false) animedetail.episodes = episodes;
  if (start_date != false) animedetail.start_date = start_date;
  if (end_date != false) animedetail.end_date = end_date;
  if (season != false) animedetail.season = season;

  let anime = new Anime(animedetail);

  anime.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Anime: " + anime);
    animes.push(anime);
    cb(null, anime);
  });
}

function genreCreate(name, cb) {
  let genre = new Studio({ name: name });

  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Genre: " + genre);
    genres.push(genre);
    cb(null, genre);
  });
}

function characterCreate(first_name, last_name, gender, age, about, cb) {
  let characterdetail = {
    gender: gender,
    age: age,
  };
  if (first_name != false) characterdetail.first_name = first_name;
  if (last_name != false) characterdetail.last_name = last_name;
  if (about != false) characterdetail.about = about;

  let character = new Character(characterdetail);
  character.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Character: " + character);
    characters.push(character);
    cb(null, character);
  });
}

function studioCreate(name, cb) {
  let studio = new Studio({ name: name });

  studio.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Studio: " + studio);
    genres.push(studio);
    cb(null, studio);
  });
}

function voiceActorCreate(first_name, last_name, gender, age, about, cb) {
  let voiceActordetail = {
    gender: gender,
    age: age,
  };
  if (first_name != false) voiceActordetail.first_name = first_name;
  if (last_name != false) voiceActordetail.last_name = last_name;
  if (about != false) voiceActordetail.about = about;

  let voiceActor = new voiceActor(voiceActordetail);
  voiceActor.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Voice Actor: " + voiceActor);
    characters.push(voiceActor);
    cb(null, voiceActor);
  });
}

function createAnime(cb) {
  async.series([
    function (callback) {

    }
  ])
}

function createGenre(cb) {
  async.series(
    [
      function (callback) {
        genreCreate("Fantasy", callback);
      },
      function (callback) {
        genreCreate("Science Fiction", callback);
      },
      function (callback) {
        genreCreate("French Poetry", callback);
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createGenre],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
