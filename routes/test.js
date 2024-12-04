const express = require("express");
const { testing, testingPostMethod } = require("../controllers/test-info");
const router = express.Router();

router.route("/").get(testing).post(testingPostMethod);

module.exports = router;
