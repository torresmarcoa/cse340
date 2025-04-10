const Util = require("../utilities");
const accountModel = require("../models/account-model")
const dashboardModel = require("../models/dashboard-model")

const dashboardController = {};

dashboardController.adminDashboardController = async function (req, res, next) {
    let nav = await Util.getNav();
    const accounts = await accountModel.getAllAccounts();
    const accountList = await Util.buildAccountList(accounts);
    res.render("./dashboard/admin-dashboard", {
        title: "Admin Dashboard",
        nav,
        accountList,
        errors: null,
    }); 
};

/* ****************************************
 *  Deliver the update account view
 * *************************************** */
dashboardController.updateUserController = async function (req, res, next) {
  const account_id = req.params.account_id;
  let nav = await Util.getNav();
  const accountData = await accountModel.getAccountById(account_id);
  res.render("dashboard/update-user", {
    title: "Edit User Info",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_type: accountData.account_type,
    account_id: accountData.account_id,
  });
}

/* ****************************************
 *  Process update request
 * ************************************ */
dashboardController.updateAccount = async function (req, res) {
  let nav = await Util.getNav();
  const { account_firstname, account_lastname, account_email, account_id, account_type } =
    req.body;

  try {
    const accountData = await dashboardModel.updateAccountProcess(
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account_type,
    );

    if (!accountData) {
      req.flash("notice", "Please check account data and try again");
      return res.status(400).render("dashboard/update-user", {
        title: "Edit User info",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_type,
        account_id,
      });
    }
    req.flash("notice", `The account for ${account_firstname} was successfully updated.`);
    res.redirect("/dashboard/admin-dashboard");
  } catch (error) {
    req.flash("notice", "Something went wrong while updating the account");
    res.status(500).render("dashboard/update-user", {
      title: "Edit User info",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      account_id,
    });
  }
}

/* ****************************************
 *  Deliver the delete account view
 * *************************************** */
dashboardController.deleteUserView = async function (req, res) {
  const account_id = req.params.account_id;
  const nav = await Util.getNav();

  try {
    const account = await accountModel.getAccountById(account_id);
    if (!account) {
      req.flash("notice", "User not found.");
      return res.redirect("/dashboard/admin-dashboard");
    }

    res.render("dashboard/delete-user", {
      title: "Delete User",
      nav,
      account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
    });
  } catch (err) {
    throw new Error("Could not load delete view: " + err.message);
  }
};

/* ****************************************
 *  Process the delete request
 * ************************************ */
dashboardController.deleteUser = async function (req, res) {
  const { account_id } = req.body;
  const nav = await Util.getNav();

  try {
    const result = await dashboardModel.deleteAccount(account_id);

    if (!result) {
      req.flash("notice", "Unable to delete the user.");
      return res.redirect("/dashboard/admin-dashboard");
    }

    req.flash("notice", "Account successfully deleted.");
    res.redirect("/dashboard/admin-dashboard");
  } catch (err) {
    req.flash("notice", "An error occurred while deleting the user.");
    res.status(500).render("dashboard/admin-dashboard", {
      title: "Admin Dashboard",
      nav,
      messages: req.flash("notice"),
    });
  }
};


module.exports = dashboardController; 