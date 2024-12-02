const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const reviewsController = require("../controllers/reviews-info.js");

const {
  isLoggedIn,
  isOwner,
  saveFutureUrl,
  isReviewAuthor,
  validateReviewSchema,
} = require("../middleware.js");

// add review
router.post(
  "/",
  isLoggedIn,
  validateReviewSchema,
  wrapAsync(reviewsController.addReview)
);

// delte Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  saveFutureUrl,
  isReviewAuthor,
  wrapAsync(reviewsController.destroyReview)
);

module.exports = router;
