const ExpressError = require("../utils/ExpressError");

module.exports.testing = (req, res, next) => {
  res.render("errors/validation");
};

module.exports.testingPostMethod = (req, res, next) => {
  throw new ExpressError(404, "testing");
};
