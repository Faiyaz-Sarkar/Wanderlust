const User = require("../Models/user.js");

// module.exports.renderSignupForm = (req, res) => {
//   res.render("listings/signup.ejs");
// };
module.exports.newUser = async (req, res, next) => {
  try {
    let { email, username, password } = req.body;
    let user = new User({
      email: email,
      username: username,
      password: password,
    });
    let registerUser = await User.register(user, password); // user created in database
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Login successful");
      res.redirect("/listings");
    });
    // req.flash("success", "user has registered");
    // res.redirect("/listing");
  } catch (err) {
    req.flash("error", "user is already exist");
    console.log(err);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("listings/login.ejs");
};

module.exports.userLogin = async (req, res) => {
  req.flash("success", "Login successful");
  let fututePath = res.locals.futurePath || "/listings";
  res.redirect(fututePath);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you have logged out");
    res.redirect("/listings");
  });
};
