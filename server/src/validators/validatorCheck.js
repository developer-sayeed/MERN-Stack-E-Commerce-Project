const { validationResult } = require("express-validator");
const { errorResponse } = require("../Helper/responseHandller");

const runValidation = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return errorResponse(res, {
        statusCode: 422,
        message: err.array()[0].msg,
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

// Export

module.exports = runValidation;
