const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minLength: [3, "the length of user name can be minimum 3 characters"],
      maxLength: [30, "the length of user name can be maximum 30 characters"],
    },
    email: {
      type: String,
      required: [true, "User Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (value) => {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        message: "please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minLength: [6, "the length of user name can be minimum 6 characters"],
      set: (value) => bcrypt.hashSync(value, bcrypt.genSaltSync(10)),
    },
    photo: {
      type: Buffer,
      contentType: String,
    },
    address: {
      type: String,
      required: [true, " Address is required"],
      minLength: [6, "the length of Address can be minimum 6 characters"],
    },
    phone: {
      type: String,
      required: [true, "User Phone is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
