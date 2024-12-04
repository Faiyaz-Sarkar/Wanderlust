const express = require("express");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveFutureUrl, isLoggedIn } = require("../middleware");
const router = express.Router();
const usersController = require("../controllers/users.info.js");

router
  .route("/signup")
  .get(usersController.renderSignupForm)
  .post(wrapAsync(usersController.newUser));

router
  .route("/login")
  .get(usersController.renderLoginForm)
  .post(
    saveFutureUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(usersController.userLogin)
  );

router.get("/logout", usersController.logout);
module.exports = router;
