const Listing = require("./Models/listing");
const Review = require("./Models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.futurePath = req.originalUrl;
    console.log(req.originalUrl);
    console.log("isLoggedIN fuction has excuted");
    req.flash("error", "you must login");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveFutureUrl = (req, res, next) => {
  if (req.session.futurePath) {
    console.log("saveFeatureUrl fuction has excuted");
    res.locals.futurePath = req.session.futurePath;
  }
  next();
};
module.exports.isOwner = async (req, res, next) => {
  console.log("isOwner fuction has excuted");

  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you don't have permission with this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you don't have permission with this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// validate listingSchema
module.exports.validateListingSchema = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    console.log(error);
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

module.exports.validateReviewSchema = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};
