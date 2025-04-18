const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" class="gridimg" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the vehicle view HTML
 * ************************************ */
Util.buildSingleView = async function (data) {
  if (!data) {
    return "<p>Error: No se encontró el vehículo.</p>";
  }
  let view = '<div id="singleView-display">';
  view += '<div class="singleImg">';
  view += `<img src="${data.inv_image}" alt="Imagen de ${data.inv_make} ${data.inv_model}">`;
  view += "</div>";
  view += '<div class="details">';
  view += `<h2><strong>${data.inv_make} ${data.inv_model} Details</strong></h2>`;
  view += `<p><strong>Description</strong>: ${data.inv_description}</p>`;
  view += `<p><strong>Price:</strong> ${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.inv_price)}</p>`;
  view += `<p><strong>Color</strong>: ${data.inv_color}</p>`;
  view += `<p><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(
    data.inv_miles
  )}</p>`;
  view += "</div>";
  view += "</div>";

  return view;
};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Buid selection view
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Checks account type
 * ************************************ */
Util.checkIfAdminOrEmployee = (req, res, next) => {
  if (
    res.locals.accountType === "Admin" ||
    res.locals.accountType === "Employee"
  ) {
    next();
  } else {
    req.flash("notice", "Please Login with a employee or admin account");
    return res.redirect("/account/login");
  }
};

Util.checkIfAdmin = (req, res, next) => {
  if (res.locals.accountType === "Admin") {
    next();
  } else {
    req.flash("notice", "Please Login with an admin account");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Build a list of all users for admin view
 * ************************************ */
Util.buildAccountList = async function (accounts) {
  let html = '<table class="account-table">';
  html +=
    "<thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Actions</th></tr></thead>";
  html += "<tbody>";

  accounts.forEach((account) => {
    html += "<tr>";
    html += `<td>${account.account_firstname} ${account.account_lastname}</td>`;
    html += `<td>${account.account_email}</td>`;
    html += `<td>${account.account_type}</td>`;
    html += `<td>
      <a href="/dashboard/update-user/${account.account_id}" class="edit-link">Edit</a>
      <span>|</span>
      <a href="/dashboard/delete-user/${account.account_id}" class="edit-link">Delete</a>
    </td>`;
    html += "</tr>";
  });

  html += "</tbody></table>";
  return html;
};

module.exports = Util;
