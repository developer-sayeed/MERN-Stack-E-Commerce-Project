const express = require("express");
const {
  getAllUser,
  getSingleUser,
  deleteSingleUser,
  CreateNewUser,
  activateUserAccount,
  editSingleUser,
  handleBanUser,
  handleUnBanUser,
  updatePassword,
  updateForgetPassword,
  updateResetPassword,
} = require("../controller/userController");
const userPhotoUpload = require("../middleware/multer");
const {
  validateUserRegistration,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
} = require("../validators/authValidator");
const runValidation = require("../validators/validatorCheck");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");

const userRouter = express.Router();

// All Routes
userRouter.get("/", isLoggedIn, isAdmin, getAllUser);
userRouter.post(
  "/register",
  isLoggedOut,
  userPhotoUpload.single("photo"),
  validateUserRegistration,
  runValidation,
  CreateNewUser
);
userRouter.post("/verify", isLoggedOut, activateUserAccount);
userRouter.get("/:id", isLoggedIn, getSingleUser);
userRouter.delete("/:id", isLoggedIn, deleteSingleUser);
userRouter.put(
  "/reset-password",
  validateUserResetPassword,
  runValidation,
  updateResetPassword
);
userRouter.put("/:id", isLoggedIn, editSingleUser);
userRouter.patch("/:id", isLoggedIn, editSingleUser);
userRouter.put("/ban-user/:id", isLoggedIn, isAdmin, handleBanUser);
userRouter.put("/unban-user/:id", isLoggedIn, isAdmin, handleUnBanUser);
userRouter.put(
  "/update-password/:id",
  validateUserPasswordUpdate,
  runValidation,
  isLoggedIn,
  updatePassword
);
userRouter.post(
  "/forget-password",
  validateUserForgetPassword,
  runValidation,
  updateForgetPassword
);
userRouter.put(
  "/reset-password",
  validateUserResetPassword,
  runValidation,
  updateResetPassword
);

module.exports = { userRouter };
