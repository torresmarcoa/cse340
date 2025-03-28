const utilities = require(".");
const { body, validationResult } = require("express-validator");
const classificationValidate = {};
const invModel = require("../models/inventory-model");

/*  **********************************
 *  New Classification Data Validation Rules
 * ********************************* */
classificationValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .matches(/^[A-Za-z]+$/)
      .withMessage("Please provide a correct classification name")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(
          classification_name
        );
        if (classificationExists) {
          throw new Error(
            "Classification already exits. Please provide a different classification name"
          );
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue 
 * ***************************** */
classificationValidate.checkClassificationData = async (req, res, next) => {
    const {classification_name} = req.body; 
    let errors = []; 
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            errors, 
            title: "Add Classification",
            nav,
            classification_name,
        });
        return;
    }
    next();
}

module.exports = classificationValidate;