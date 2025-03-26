// Needed Resources
const express = require("express");
const router = express.Router();
const Util = require("../utilities/");
const regValidate = require("../utilities/account-validation");
const accountController = require("../controllers/accountController");

// Delivers Login View
router.get("/login", Util.handleErrors(accountController.buildLogin));

// Deliver Registration View
router.get("/register", Util.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  Util.handleErrors(accountController.registerAccount)
);
module.exports = router;
