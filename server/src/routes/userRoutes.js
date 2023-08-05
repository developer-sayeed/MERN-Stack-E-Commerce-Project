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
} = require("../controller/userController");
const userPhotoUpload = require("../middleware/multer");
const { validateUserRegistration } = require("../validators/authValidator");
const runValidation = require("../validators/validatorCheck");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");

const userRouter = express.Router();

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
userRouter.put("/:id", isLoggedIn, editSingleUser);
userRouter.patch("/:id", isLoggedIn, editSingleUser);
userRouter.put("/ban-user/:id", isLoggedIn, isAdmin, handleBanUser);
userRouter.put("/unban-user/:id", isLoggedIn, isAdmin, handleUnBanUser);

module.exports = { userRouter };
