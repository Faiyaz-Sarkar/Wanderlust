const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listings-info.js");
const multer = require("multer");

const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const {
  isLoggedIn,
  isOwner,
  validateListingSchema,
  saveFutureUrl,
} = require("../middleware.js");

// all routes and Create
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListingSchema,
    wrapAsync(listingController.addListing)
  );

// search route
router.post("/search", listingController.index);
// new
router.get(
  "/new",
  isLoggedIn,
  saveFutureUrl,
  listingController.renderListingForm
);

// show, delete, update routes
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .delete(isOwner, wrapAsync(listingController.deleteListing))
  .put(
    isLoggedIn,
    isOwner,
    saveFutureUrl,
    upload.single("image"),
    wrapAsync(listingController.updateListing)
  );

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  saveFutureUrl,
  isOwner,
  wrapAsync(listingController.editListing)
);
module.exports = router;

// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const listingController = require("../controllers/listings-info.js");
// const multer = require("multer");
// const { storage } = require("../cloudConfig.js");
// const upload = multer({ storage });
// const {
//   isLoggedIn,
//   isOwner,
//   validateListingSchema,
//   saveFutureUrl,
// } = require("../middleware.js");

// // all routes and Create
// router
//   .route("/")
//   .get(wrapAsync(listingController.index))
//   .post(
//     upload.single("listing[image]"), // Fixed: Removed the callback here
//     (req, res) => {
//       console.log(req.file);
//       res.send("hi"); // Send file back after upload
//     }
//   );

// // new
// router.get(
//   "/new",
//   isLoggedIn,
//   saveFutureUrl,
//   listingController.renderListingForm
// );

// // show, delete, edit, update routes
// router
//   .route("/:id")
//   .get(wrapAsync(listingController.showListing))
//   .delete(
//     isLoggedIn,
//     isOwner,
//     saveFutureUrl,
//     wrapAsync(listingController.deleteListing)
//   )
//   .get(
//     isLoggedIn,
//     saveFutureUrl,
//     isOwner,
//     wrapAsync(listingController.editListing)
//   )
//   .put(isLoggedIn, isOwner, wrapAsync(listingController.updateListing));

// module.exports = router;
