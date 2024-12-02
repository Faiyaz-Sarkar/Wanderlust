const Listing = require("../Models/listing");

module.exports.index = async (req, res) => {
  let data = await Listing.find({});
  res.render("listings/index.ejs", { data });
};

module.exports.renderListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.addListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();

  req.flash("success", "new listing has added");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  let singleData = await Listing.findById(id);
  if (!singleData) {
    req.flash("error", "listing does not exist");
    res.redirect("/listings");
  }
  let listing = await Listing.findOne({
    _id: id,
  })
    .populate({ path: "reviews", populate: "author" })
    .populate("owner");
  let reviews = listing.reviews;
  let owner = listing.owner;
  res.render("listings/show.ejs", {
    singleData,
    reviews,
    owner,
  });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let singleData = await Listing.findById(id);
  if (!singleData) {
    req.flash("error", "listing doesn't exist");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { singleData });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let { title, description, image, price, location, country } = req.body;

  await Listing.findByIdAndUpdate(
    id,
    {
      title: title,
      description: description,
      image: {
        url: image,
      },
      price: price,
      location: location,
      country: country,
    },
    { runValidators: true, new: true }
  );
  console.log(req.body);
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res, next) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect(`/listings`);
};
