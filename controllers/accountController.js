const Util = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */

async function buildLogin(req, res, next) {
  1;
  let nav = await Util.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await Util.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await Util.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await Util.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver successful log in view
 * *************************************** */
async function builSucessLogin(req, res, next) {
  let nav = await Util.getNav();
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver the update account view
 * *************************************** */
async function builUpdateView(req, res, next) {
  const account_id = req.params.account_id;
  let nav = await Util.getNav();
  const accountData = await accountModel.getAccountById(account_id);
  console.log(account_id);
  res.render("account/update", {
    title: "Edit User Info",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
}

/* ****************************************
 *  Process update request
 * ************************************ */
async function updateAccount(req, res) {
  let nav = await Util.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;

  try {
    const accountData = await accountModel.updateAccountProcess(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (!accountData) {
      req.flash("notice", "Please check account data and try again");
      return res.status(400).render("account/update", {
        title: "Edit User info",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
      });
    }

    req.flash("notice", `${account_firstname} account successfully updated`);
    res.redirect("/account/");
  } catch (error) {
    req.flash("notice", "Something went wrong while updating the account");
    res.status(500).render("account/update", {
      title: "Edit User info",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

async function updatePassword(req, res) {
  const { account_id, account_password } = req.body;
  let nav = await Util.getNav();

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const result = await accountModel.updateAccountPassword(
      account_id,
      hashedPassword
    );

    if (result) {
      req.flash("notice", "Password successfully updated");
      return res.redirect("/account");
    } else {
      req.flash("notice", "Password update failed");
      return res
        .status(400)
        .render("account/update", {
          nav,
          errors: null,
          title: "Edit User Info",
        });
    }
  } catch (error) {
    req.flash("notice", "An error occurred while updating the password");
    return res
      .status(500)
      .render("account/update", { nav, errors: null, title: "Edit User Info" });
  }
}

// Function to log out
function logoutAccount(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "Successfully logged out");
  return res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  builSucessLogin,
  builUpdateView,
  updateAccount,
  updatePassword,
  logoutAccount,
};
