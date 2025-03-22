const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");
const utilities = require("../utilities/");

// Route to trigger a 500 error
router.get("/intentional-error", utilities.handleErrors(errorController.triggerError));

module.exports = router;
