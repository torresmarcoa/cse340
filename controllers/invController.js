const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    error: null,
  });
};

/* ***************************
 *  Add Classification
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Add Vehicle
 * ************************** */
invCont.buildAddVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  let buildClassificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-vehicle", {
    title: "Add New Vehicle",
    nav,
    buildClassificationList,
    errors: null,
  });
};

/* ****************************************
 *  Process New classification
 * *************************************** */
invCont.newClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const newClassificationResult = await invModel.registerClassification(
    classification_name
  );

  if (newClassificationResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added!`
    );
    res.status(201).render("/inventory/management.ejs", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, the registration of a new classification failed."
    );
    res.status(501).render("inv/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

invCont.newVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  let buildClassificationList = await utilities.buildClassificationList()
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  const newVehicleResult = await invModel.registerVehicle(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );

  if (newVehicleResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added!`
    );
    res.status(201).render("inventory/management.ejs", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, the registration of a new vehicle failed."
    );
    res.status(501).render("inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      buildClassificationList,
      errors: null,
    });
  }
};

module.exports = invCont;
