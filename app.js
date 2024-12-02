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
(ejsMate = require("ejs-mate")), app.engine("ejs", ejsMate);
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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

// locals variable
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.currUser = req.user;
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/authenticate", authenticateRouter);

// Page not found error
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "something were wrong", name } = err;
  if (err) {
    res.status(status).send(message);
    console.log(err);
  }
});
// if (process.env.NODE_ENV != "production") {
//   require("dotenv").config();
// }
// const express = require("express");
// var cookieParser = require("cookie-parser");
// let flash = require("connect-flash");
// const mongoose = require("mongoose");
// const ExpressError = require("./utils/ExpressError.js");
// const app = express();
// const path = require("path");
// const session = require("express-session");
// const listingsRouter = require("./routes/listings.js");
// const reviewsRouter = require("./routes/reviews.js");
// const authenticateRouter = require("./routes/users.js");
// const methodOverride = require("method-override");

// console.log(
//   process.env.CLOUD_NAME,
//   process.env.CLOUD_API_KEY,
//   process.env.CLOUD_API_SECRET
// );

// const User = require("./Models/user.js");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// (ejsMate = require("ejs-mate")), app.engine("ejs", ejsMate);
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "/public")));

// // Database connection
// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
// }
// main()
//   .then(() => {
//     console.log("Database server started");
//   })
//   .catch((err) => console.log(err));

// // Server is listening at port 3000
// app.listen(3000, (req, res) => {
//   console.log("Server is listening at port 3000");
// });

// // EJS setup
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // Cookie parser
// app.use(cookieParser("secret"));

// // Session configuration
// const sessionOptions = {
//   secret: "mysecretstring",
//   saveUninitialized: true,
//   resave: false,
//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     httpOnly: true,
//   },
// };

// // Express-session middleware
// app.use(session(sessionOptions));

// // Flash middleware
// app.use(flash());

// // Passport authentication middleware
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // Data parsing
// app.use(express.urlencoded({ extended: true }));

// // Global variables for flash messages and current user
// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.currUser = req.user;
//   res.locals.error = req.flash("error");
//   next();
// });

// // Routes
// app.use("/listings", listingsRouter);
// app.use("/listings/:id/reviews", reviewsRouter);
// app.use("/authenticate", authenticateRouter);

// // Page not found error
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   const { status = 500, message = "Something went wrong" } = err;
//   res.status(status).send(message);
//   console.error(err);
// });
