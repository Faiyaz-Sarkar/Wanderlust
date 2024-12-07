if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
var cookieParser = require("cookie-parser");
let flash = require("connect-flash");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const app = express();
const path = require("path");
const session = require("express-session");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const authenticateRouter = require("./routes/users.js");
const methodOverride = require("method-override");
const User = require("./Models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate); // Setting up EJS engine
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// database
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then(() => {
    console.log("database server started");
  })
  .catch((err) => console.log(err));

// server is listening at 3000 port
app.listen(3000, (req, res) => {
  console.log("server is listening at 3000 port");
});

// ejs
app.set("views", path.join(__dirname, "views")); // Base directory for views
app.set("view engine", "ejs"); // Template engine

// cookie parse
app.use(cookieParser("secret"));

const sessionOptions = {
  secret: "mysecretstring",
  saveUninitialized: true,
  resave: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// express-session
app.use(session(sessionOptions));

// flash
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// data parse
app.use(express.urlencoded({ extended: true }));

// locals variables
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.currUser = req.user;
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", authenticateRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

// Page not found error
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "something were wrong", name } = err;

  if (err) {
    console.log(
      `Error name : ${name}, Message : ${message}, Error Stack : ${err.stack}`
    );
    res.send(message);
  }
});
