const express = require("express");
const router = express.Router();
const Util = require("../utilities/");
const dashboardController = require("../controllers/dashboardController");
const validate = require("../utilities/account-validation")
const accountController = require("../controllers/accountController")

// Dashboard View
router.get(
  "/admin-dashboard",
  Util.checkIfAdmin,
  Util.handleErrors(dashboardController.adminDashboardController)
);

// Update View
router.get(
  "/update-user/:account_id",
  Util.checkIfAdmin,
  Util.handleErrors(dashboardController.updateUserController)
)

// Process the update attempt
router.post(
  "/update-user/",
  Util.checkIfAdmin,
  validate.updateRulesforAdmin(),
  validate.checkUpdateDataForAdmin,
  Util.handleErrors(dashboardController.updateAccount)
)

// Process the update password attempt
router.post(
  "/update-password/",
  Util.checkIfAdmin,
  validate.passwordRules(),
  validate.checkPasswordRules,
  Util.handleErrors(accountController.updatePassword)
);

// Delete view
router.get(
  "/delete-user/:account_id",
  Util.checkIfAdmin,
  Util.handleErrors(dashboardController.deleteUserView)
)

// Process the delete attempt
router.post(
  "/delete-user/",
  Util.checkIfAdmin,
  Util.handleErrors(dashboardController.deleteUser)
)

module.exports = router;
