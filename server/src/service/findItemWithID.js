const mongoose = require("mongoose");
const createError = require("http-errors");

const findWithID = async (Model, id, option = {}) => {
  try {
    // get user data from database
    const item = await Model.findById(id, option);

    // valadation User
    if (!item) {
      throw createError(404, `${Model.modelName} don't exist with this ID`);
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "invalid user ID");
    }
    throw error;
  }
};

// Export
module.exports = { findWithID };
