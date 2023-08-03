const express = require("express");
const {
  getAllUser,
  getSingleUser,
  deleteSingleUser,
  CreateNewUser,
  activateUserAccount,
  editSingleUser,
} = require("../controller/userController");
const userPhotoUpload = require("../middleware/multer");
const { validateUserRegistration } = require("../validators/authValidator");
const runValidation = require("../validators/validatorCheck");
const userRouter = express.Router();

userRouter.get("/", getAllUser);
userRouter.post(
  "/register",
  // userPhotoUpload.single("photo"),
  validateUserRegistration,
  runValidation,
  CreateNewUser
);
userRouter.post("/verify", activateUserAccount);
userRouter.get("/:id", getSingleUser);
userRouter.delete("/:id", deleteSingleUser);
userRouter.put("/:id", editSingleUser);
userRouter.patch("/:id", editSingleUser);

module.exports = { userRouter };
