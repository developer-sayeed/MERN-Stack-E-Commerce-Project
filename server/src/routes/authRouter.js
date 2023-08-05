const express = require("express");

const runValidation = require("../validators/validatorCheck");
const { handleLogin, handleLogout } = require("../controller/authController");
const { isLoggedOut, isLoggedIn } = require("../middleware/auth");
const { validateUserLogin } = require("../validators/authValidator");
const authRouter = express.Router();

authRouter.post(
  "/login",
  validateUserLogin,
  runValidation,
  isLoggedOut,
  handleLogin
);
authRouter.post("/logout", isLoggedIn, handleLogout);

// Export
module.exports = { authRouter };
