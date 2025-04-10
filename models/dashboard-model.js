// Required resources
const pool = require("../database/");

/* *****************************
 *   Update account
 * *************************** */
async function updateAccountProcess(
  account_id,
  account_firstname,
  account_lastname,
  account_email,
  account_type
) {
  try {
    const result = await pool.query(
      `UPDATE public.account
       SET account_firstname = $1,
           account_lastname = $2,
           account_email = $3,
           account_type = $5
       WHERE account_id = $4
       RETURNING *`,
      [
        account_firstname,
        account_lastname,
        account_email,
        account_id,
        account_type,
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Model error: " + error.message);
  }
}

async function deleteAccount(account_id) {
    try {
      const result = await pool.query(
        `DELETE FROM public.account WHERE account_id = $1 RETURNING *`,
        [account_id]
      );
      return result.rowCount > 0;
    } catch (error) {
      throw new Error("Database error: " + error.message);
    }
  }
  

module.exports = {
  updateAccountProcess,
  deleteAccount,
};
