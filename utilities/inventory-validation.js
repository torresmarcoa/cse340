const utilities = require(".");
const { body, validationResult } = require("express-validator");

const inventoryValidation = {};

/*  **********************************
 *  Update Vehicle Data Validation Rules
 * ********************************* */
inventoryValidation.vehicleRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a Classification"),
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a Make for the vehicle"),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a Model for the vehicle"),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a Description for the vehicle"),
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide an Image for the vehicle"),
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a Thumbnail for the vehicle"),
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a Price for the vehicle"),
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a Year for the vehicle"),
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide Mileage for the vehicle"),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a Color for the vehicle"),
  ];
};

inventoryValidation.checkUpdateData = async (req, res, next) => {
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
    inv_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationSelect = await utilities.buildClassificationList(classification_id);
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit" + inv_make + inv_model,
      nav,
      classificationSelect,
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
      inv_id,
    });
    return;
  }
  next();
};

module.exports = inventoryValidation;
