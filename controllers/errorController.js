const errorController = {};

// Function to trigger an intentional 500 error
errorController.triggerError = async function (req, res, next) {
  try {
    throw new Error("This is an intentional 500 error for testing purposes.");
  } catch (error) {
    next(error);
  }
};

module.exports = errorController;
