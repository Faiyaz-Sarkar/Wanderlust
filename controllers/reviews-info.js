const Listing = require("../Models/listing");
const Review = require("../Models/review");

module.exports.addReview = async (req, res) => {
  let { id } = req.params;
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  let currentListing = await Listing.findById(id);
  currentListing.reviews.push(newReview);
  await newReview.save();
  await currentListing.save();
  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  console.log(id, reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};
