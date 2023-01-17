let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let livereload = require("livereload");
let connectLiveReload = require("connect-livereload");
const expressLayouts = require("express-ejs-layouts");

const mongoose = require("mongoose");
const dev_db_url =
  "mongodb+srv://Jarrett:Atlaspassword@cluster0.ij9lbaq.mongodb.net/aniexpress?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const indexRouter = require("./routes/index");
const animeRouter = require("./routes/animeRoute");
const genreRouter = require("./routes/genreRoute");
const compression = require("compression");

let app = express();

app.use(compression());

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
app.use(connectLiveReload());

// view engine setup
app.engine("ejs", require("express-ejs-extend")); // add this line
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/anime", animeRouter);
app.use("/genre", genreRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
