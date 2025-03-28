// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const Util = require("../utilities/");
const classificationValidate = require("../utilities/newClassification-validation");
const vehicleValidate = require("../utilities/newVehicle-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));

// Route for build vehicle management 
router.get("/", Util.handleErrors(invController.buildManagement));

// Route to build add clasification
router.get("/add-classification", Util.handleErrors(invController.buildAddClassification));

// Route to build add view
router.get("/add-vehicle", Util.handleErrors(invController.buildAddVehicle));

// Process the add classification attemp
router.post(
    "/add-classification",
    classificationValidate.classificationRules(), 
    classificationValidate.checkClassificationData,
    Util.handleErrors(invController.newClassification)
);

// Process the add vehicle attemp
router.post(
    "/add-vehicle",
    vehicleValidate.vehicleRules(),
    vehicleValidate.checkVehicleData,
    Util.handleErrors(invController.newVehicle)
)

module.exports = router;