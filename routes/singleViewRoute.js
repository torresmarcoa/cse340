// Needed Resources
const express = require("express")
const router = new express.Router()
const singleViewController = require("../controllers/singleViewController")
const Util = require("../utilities/")

// Route to build single view inventory 
router.get("/detail/:invId", Util.handleErrors(singleViewController.buildBySingleViewController));

module.exports = router;
