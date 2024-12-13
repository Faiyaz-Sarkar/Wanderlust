const mongoose = require("mongoose");
const Listing = require("../Models/listing.js");
const initData = require("./data.js");
async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
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
      owner: "675aa227eab9f17f93face98",
      geometry: {
        type: "Point",
        coordinates: [91.86, 24.9048],
      },
      category: "countryside",
    };
  });
  let listingData = await Listing.insertMany(initData.data);
  console.log("data was intialized", listingData.length);
};
initDB();
