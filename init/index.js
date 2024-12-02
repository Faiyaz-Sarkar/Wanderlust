const mongoose = require("mongoose");
const Listing = require("../Models/listing.js");
const initData = require("./data.js");
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then(() => {
    console.log("mongoDB server started");
  })
  .catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => {
    return {
      ...obj,
      owner: "6745e75abf8ae40eb966b079",
    };
  });
  let listingData = await Listing.insertMany(initData.data);
  console.log("data was intialized", listingData.length);
};
initDB();
