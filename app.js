if (process.env.NODE_ENV !== "production") {
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
const MongoStore = require("connect-mongo");
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

const mongodbLocalUrl = "mongodb://localhost:27017/wanderlust";
// Database
async function main() {
  try {
    await mongoose.connect(process.env.mongodbAtlasUrl, {
      connectTimeoutMS: 30000, // 30-second timeout for the connection
    });
    console.log("Database server started");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
}
main();

// Server is listening at port 3000
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

// EJS
app.set("views", path.join(__dirname, "views")); // Base directory for views
app.set("view engine", "ejs"); // Template engine

// Cookie parser
app.use(cookieParser("squirrel999"));

const store = MongoStore.create({
  mongoUrl: process.env.mongodbAtlasUrl,
  crypto: {
    secret: "squirrel999",
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret: "squirrel999",
  saveUninitialized: true,
  resave: false,
};

// Express-session
app.use(session(sessionOptions));

// Flash
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Data parsing
app.use(express.urlencoded({ extended: true }));

// Local variables
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
  const { status = 500, message = "Something went wrong", name } = err;

  if (err) {
    console.log(
      `Error name : ${name}, Message : ${message}, Error Stack : ${err.stack}`
    );
    res.status(status).send(message); // Send the error message and status
  }
});
