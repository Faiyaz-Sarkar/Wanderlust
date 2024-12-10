const express = require("express");
const User = require("../Models/user");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
router
  .route("/signup")
  .get((req, res) => {
    res.render("listings/signup");
  })
  .post(
    wrapAsync(async (req, res, next) => {
      const { username, email, password } = req.body;
      const newUser = await User({
        email: email,
        username: username,
      });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          console.log("registered user error", err);
          return next(err);
        }
      });
      req.flash("success", "signup success");
      console.log(registeredUser);
      res.redirect("/listings");
    })
  );

module.exports = router;
