const mongoose = require("mongoose");
const User = require("./user.js");
const Schema = mongoose.Schema;

const reviewSchema = {
  comment: { type: String, required: true },
  rating: {
    type: Number,
    max: 5,
    min: 1,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
};

// Model
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
