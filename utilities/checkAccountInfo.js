const jwt = require("jsonwebtoken")
const accountModel = require("../models/account-model")

// Function to check account info from account-models
const checkAccountInfo = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const accountId = decoded.account_id;

      const account = await accountModel.getAccountById(accountId);

      if (account) {
        res.locals.loggedIn = true;
        res.locals.accountFirstName = account.account_firstname;
        res.locals.accountType = account.account_type;
        res.locals.accountId = account.account_id;
      } else {
        res.locals.loggedIn = false;
        res.locals.accountFirstName = "";
        res.locals.accountType = "";
      }
    } catch (error) {
      res.locals.loggedIn = false;
      res.locals.accountFirstName = "";
      res.locals.accountType = "";
    }
  } else {
    res.locals.loggedIn = false;
    res.locals.accountFirstName = "";
    res.locals.accountType = "";
  }

  next();
};

module.exports = checkAccountInfo;
