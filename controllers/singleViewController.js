const singleViewModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const singleCont = {}

/* ***************************
 *  Build inventory by Inventory view
 * ************************** */ 

singleCont.buildBySingleViewController = async function (req, res, next) {
    const inv_id = req.params.invId
    const result = await singleViewModel.getInventoryByInventoryId(inv_id)
    const data = result
    const view = await utilities.buildSingleView(data)
    let nav = await utilities.getNav()
    res.render("./inventory/detail", {
        title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
        nav,
        view,
        errors: null,
    })
}

module.exports = singleCont