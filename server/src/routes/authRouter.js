const express = require("express");

const runValidation = require("../validators/validatorCheck");
const {
  handleLogin,
  handleLogout,
  handlerefreshToken,
  handleProtectedRoutes,
} = require("../controller/authController");
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
authRouter.get("/refresh-token", handlerefreshToken);
authRouter.get("/protected", handleProtectedRoutes);

// Export
module.exports = { authRouter };
