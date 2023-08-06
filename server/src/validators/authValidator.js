const { body } = require("express-validator");

// Register validation
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required, Enter Your Name")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name Should be between 3 and 31 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required, Enter Your Email")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Pasword is required, Enter Your Password")
    .isLength({ min: 6, max: 30 })
    .withMessage("Pasword Should be between 6 and 30 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "password should be contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required, Enter a valid address")
    .isLength({ min: 6 })
    .withMessage("Address can be minimum 6 characters long"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required, Enter Your Phone Number"),
  body("photo")
    .custom((value, { req }) => {
      if (!req.file || !req.file.buffer) {
        throw new Error("User Photo is required");
      }
      return true;
    })
    .optional()
    .withMessage("Photo is required"),
];

// User Login validation
const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required, Enter Your Email")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Pasword is required, Enter Your Password")
    .isLength({ min: 6, max: 30 })
    .withMessage("Pasword Should be between 6 and 30 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "password should be contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
];

// Update Password validation
const validateUserPasswordUpdate = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("oldPasword is required, Enter Your Password")
    .isLength({ min: 6, max: 30 })
    .withMessage("OldPassword Should be between 6 and 30 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "password should be contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("NewPasword is required, Enter Your Password")
    .isLength({ min: 6, max: 30 })
    .withMessage("NewPassword Should be between 6 and 30 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "password should be contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password did not match");
    }
    return true;
  }),
];

// Forget Password validation
const validateUserForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required, Enter Your Email")
    .isEmail()
    .withMessage("Invalid email address"),
];
// Rerset password validation
const validateUserResetPassword = [
  body("token").trim().notEmpty().withMessage("Token is Messing,"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Pasword is required, Enter Your Password")
    .isLength({ min: 6, max: 30 })
    .withMessage("Pasword Should be between 6 and 30 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    )
    .withMessage(
      "password should be contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
];
// Export
module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
};
