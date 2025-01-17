const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: {
      type: String,
      set: (v) =>
        v === ""
          ? "https://a0.muscache.com/im/pictures/miso/Hosting-694055224756906854/original/76f85a0c-b3e2-4f1d-9aa9-d7838f2393c6.jpeg?im_w=1200&im_q=highq"
          : v,
    },
    filename: {
      type: String,
      default: "listingimage",
    },
  },
  price: Number,
  location: String,
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
    },
  },
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",
  },
  category: {
    type: String,
    enum: [
      "countryside",
      "bed",
      "island",
      "urban",
      "mountain",
      "beach",
      "cabin",
      "lakeside",
      "historical",
      "desert",
      "luxury",
      "adventure",
    ],
  },
});
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// Model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
