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
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    error: null,
    classificationSelect,
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
    res.redirect("/inv/")
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

/* ****************************************
 *  Process New Vehicle
 * *************************************** */
invCont.newVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  let buildClassificationList = await utilities.buildClassificationList();
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
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added!`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the registration of a new vehicle failed.");
    res.status(501).render("inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      buildClassificationList,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInventoryId(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInventoryId(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
  });
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { inv_id } = req.body;
  const updateResult = await invModel.deleteInventory(
    parseInt(inv_id),
  );
  if (updateResult) {
    req.flash("notice", `The vehicle was Deleted.`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the deleted failed.");
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete Vehicle",
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_miles,
    });
  }
};

module.exports = invCont;
