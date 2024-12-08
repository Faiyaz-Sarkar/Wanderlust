const Listing = require("../Models/listing.js");

const forwardGeocode = async (place) => {
  const apiKey = process.env.MAPTILER_API_KEY; // Replace with your MapTiler API key
  // const url = `https://api.maptiler.com/geocoding/${place}.json?key=${apiKey}`;
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(
    place
  )}.json?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const coordinates = data.features[0].geometry; // [longitude, latitude]
      return coordinates;
    } else {
      console.log("No results found.");
    }
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
  }
};

module.exports.index = async (req, res) => {
  console.log(req.user);
  const { country } = req.body;
  const { category } = req.query; // Dynamically get category from query parameters
  let data;

  if (category) {
    data = await Listing.find({ category }); // Fetch listings matching the category
  } else if (country) {
    data = await Listing.find({ country }); // Fetch listings matching the category
  } else {
    data = await Listing.find({}); // Fetch all listings if no category is specified
  }

  // console.log(`Category: ${category || "All"}`);
  // console.log(`Number of listings: ${data.length}`);

  res.render("listings/index.ejs", { data });
};

module.exports.renderListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.addListing = async (req, res, next) => {
  console.log(req.body.listing);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  const { path, filename, orginalname } = req.file;
  newListing.image.url = path;
  newListing.image.filename = filename;
  const geometry = await forwardGeocode(req.body.listing.location);
  newListing.geometry = geometry;
  await newListing.save();
  console.log(newListing);
  req.flash("success", "new listing has added");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: "author" })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing does not exist");
    res.redirect("/listings");
  }
  await Listing.findOne({
    _id: id,
  });

  let reviews = listing.reviews;
  let owner = listing.owner;
  res.render("listings/show.ejs", {
    listing,
    reviews,
    owner,
  });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let orginalUrl = listing.image.url;
  orginalUrl = orginalUrl.replace(
    "/upload",
    "/upload/c_thumb,g_face,h_200,w_200/r_max/f_auto"
  );
  if (!listing) {
    req.flash("error", "listing doesn't exist");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing, orginalUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let {
    title,
    description,
    image: imgUrl,
    price,
    location,
    category,
    country,
  } = req.body;
  console.log(imgUrl);
  let currListing = await Listing.findById(id);
  let newListing = await Listing.findByIdAndUpdate(
    id,
    {
      title: title,
      description: description,
      image: {
        url: currListing.image.url,
        filename: "image",
      },
      price: price,
      location: location,
      category: category,
      country: country,
    },
    { runValidators: true, new: true }
  );
  if (newListing.location !== currListing.location) {
    const geometry = await forwardGeocode(newListing.location);
    newListing.geometry = geometry;
    await newListing.save();
  }
  if (typeof req.file !== "undefined") {
    let { path, filename } = req.file;
    newListing.image = { url: path, filename: filename };
    await newListing.save();
  }
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res, next) => {
  let { id } = req.params;
  console.log("delete");
  await Listing.findByIdAndDelete(id);
  res.redirect(`/listings`);
};
