const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const User = require("../model/userModel.js");
const { successResponse } = require("../Helper/responseHandller.js");
const { CreateJSONWebtoken } = require("../Helper/jsonWebtoken.js");
const jwt = require("jsonwebtoken");
const {
  setAccessTokenCookie,
  setrefreshTokenCookie,
} = require("../Helper/cookies.js");

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
    setAccessTokenCookie(res, accessToken);

    // Refresh jwt token
    const refreshToken = CreateJSONWebtoken(
      { user },
      process.env.JWT_REFRESH_KEY,
      7 * 24 * 60 * 60 * 1000 // 7 days
    );
    setrefreshTokenCookie(res, refreshToken);

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
    res.clearCookie("refreshToken");
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
 * @DESC Handle refresh Token
 * @ROUTE /api/v1/auth/refreh-token
 * @method POST
 * @access private
 */
const handlerefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    // verify old Refresh Token

    const decodedToken = jwt.verify(
      oldRefreshToken,
      process.env.JWT_REFRESH_KEY
    );

    if (!decodedToken) {
      throw createError(401, `Invalid refresh token, Please Login Again`);
    }
    const accessToken = CreateJSONWebtoken(
      decodedToken.user,
      process.env.JWT_ACCCESS_KEY,
      15 * 60 * 1000 // 15 minutes
    );
    setAccessTokenCookie(res, accessToken);
    // Success response
    return successResponse(res, {
      statusCode: 200,
      message: "New Access Token is generated",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @DESC handle Protected Routes
 * @ROUTE /api/v1/auth/protected
 * @method POST
 * @access private
 */
const handleProtectedRoutes = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    // verify old Refresh Token

    const decodedToken = jwt.verify(accessToken, process.env.JWT_ACCCESS_KEY);

    if (!decodedToken) {
      throw createError(401, `Invalid Access token, Please Login Again`);
    }

    // Success response
    return successResponse(res, {
      statusCode: 200,
      message: "protected Resource accessed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Export
module.exports = {
  handleLogin,
  handleLogout,
  handlerefreshToken,
  handleProtectedRoutes,
};
