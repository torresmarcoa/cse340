// Needed Resources
const express = require("express");
const router = express.Router();
const Util = require("../utilities/");
const regValidate = require("../utilities/account-validation");
const loingvalidate = require("../utilities/login-validation")
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

// Process the login attempt
router.post(
  "/login",
  loingvalidate.loginRules(),
  loingvalidate.checklogData,
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;
