const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const User = require("../model/userModel.js");
const { successResponse } = require("../Helper/responseHandller.js");
const { CreateJSONWebtoken } = require("../Helper/jsonWebtoken.js");
const jwt = require("jsonwebtoken");

/**
 * @DESC Login Authentication
 * @ROUTE /api/v1/auth/login
 * @method POST
 * @access private
 */

const handleLogin = async (req, res, next) => {
  try {
    //email,password checking
    const { email, password } = req.body;

    //isExist
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "user Does not Exist, please register First");
    }
    //Compare the password

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createError(404, "Password Does not Match, please Try again");
    }
    // isBanned
    if (user.isBanned) {
      throw createError(403, "You are Banned. Please Contact administrator");
    }

    // token, Cookies
    // create jwt token
    const accessToken = CreateJSONWebtoken(
      { user },
      process.env.JWT_ACCCESS_KEY,
      15 * 60 * 1000 // 15 minutes
    );
    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    const userWithOutPassword = await User.findOne({ email }).select(
      "-password"
    );
    // Success response
    return successResponse(res, {
      statusCode: 200,
      message: "Logged in Success",
      payload: { userWithOutPassword },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @DESC Logout User
 * @ROUTE /api/v1/auth/logout
 * @method POST
 * @access private
 */
const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    // Success response
    return successResponse(res, {
      statusCode: 200,
      message: "Logged out Success",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @DESC Logout User
 * @ROUTE /api/v1/auth/logout
 * @method POST
 * @access private
 */

// Export
module.exports = { handleLogin, handleLogout };
