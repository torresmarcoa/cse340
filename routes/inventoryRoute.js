// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const Util = require("../utilities/");
const classificationValidate = require("../utilities/newClassification-validation");
const vehicleValidate = require("../utilities/newVehicle-validation");
const inventoryValidation = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  Util.handleErrors(invController.buildByClassificationId)
);

// Route for build vehicle management
router.get(
  "/",
  Util.checkIfAdminOrEmployee,
  Util.handleErrors(invController.buildManagement)
);

// Build inventory ajax route
router.get(
  "/getInventory/:classification_id",
  Util.checkIfAdminOrEmployee,
  Util.handleErrors(invController.getInventoryJSON)
);

// Route to build add clasification
router.get(
  "/add-classification",
  Util.checkIfAdminOrEmployee,
  Util.handleErrors(invController.buildAddClassification)
);

// Route to build add view
router.get(
  "/add-vehicle",
  Util.checkIfAdminOrEmployee,
  Util.handleErrors(invController.buildAddVehicle)
);

// Process the add classification attemp
router.post(
  "/add-classification",
  Util.checkIfAdminOrEmployee,
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  Util.handleErrors(invController.newClassification)
);

// Process the add vehicle attemp
router.post(
  "/add-vehicle",
  Util.checkIfAdminOrEmployee,
  vehicleValidate.vehicleRules(),
  vehicleValidate.checkVehicleData,
  Util.handleErrors(invController.newVehicle)
);

// Route to build edit view
router.get(
  "/edit/:inventory_id",
  Util.checkIfAdminOrEmployee,
  Util.handleErrors(invController.editInventoryView)
);

// Process the edit vehicle attemp
router.post(
  "/update/",
  Util.checkIfAdminOrEmployee,
  inventoryValidation.vehicleRules(),
  inventoryValidation.checkUpdateData,
  Util.handleErrors(invController.updateInventory)
);

// Route to get delete view
router.get(
  "/delete/:inventory_id",
  Util.checkIfAdminOrEmployee,
  Util.handleErrors(invController.deleteInventoryView)
);

// Process the delete inventory attemp
router.post(
  "/delete",
  Util.checkIfAdminOrEmployee,
  Util.handleErrors(invController.deleteInventory)
);

module.exports = router;
