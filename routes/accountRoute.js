// Needed Resources
const express = require("express");
const router = express.Router();
const Util = require("../utilities/");
const regValidate = require("../utilities/account-validation");
const loingvalidate = require("../utilities/login-validation");
const accountController = require("../controllers/accountController");
const validate = require("../utilities/account-validation");

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
  Util.handleErrors(accountController.accountLogin)
);

// Delivers success log in
router.get(
  "/",
  Util.checkLogin,
  Util.handleErrors(accountController.builSucessLogin)
);

// Delivers the update view
router.get(
  "/update/:account_id",
  Util.checkLogin,
  Util.handleErrors(accountController.builUpdateView)
);

//  Process the update attempt
router.post(
  "/update/",
  validate.updateRules(),
  validate.checkUpdateData,
  Util.handleErrors(accountController.updateAccount)
);

// Process the update password attempt
router.post(
  "/update-password/",
  validate.passwordRules(),
  validate.checkPasswordRules,
  Util.handleErrors(accountController.updatePassword)
);

// Process the logout attemp
router.get("/logout", Util.handleErrors(accountController.logoutAccount));

module.exports = router;
