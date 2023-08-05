const createError = require("http-errors");
const jwt = require(`jsonwebtoken`);

// Configuration Logged in User Middleware
const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw createError(401, "Access token Not Found, please Login Again");
    }
    // Verify User
    const decoded = jwt.verify(token, process.env.JWT_ACCCESS_KEY);

    if (!decoded) {
      throw createError(401, "Invalid Access Token, please Login Again");
    }
    req.user = decoded.user;
    next();
  } catch (error) {
    return next(error);
  }
};

// Configuration LoggedOut User Middleware
const isLoggedOut = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (token) {
      throw createError(400, "User Is Already Logged In");
    }
    next();
  } catch (error) {
    return next(error);
  }
};

// Configuration LoggedOut User Middleware
const isAdmin = (req, res, next) => {
  try {
    const admin = req.user.isAdmin;

    if (!req.user.isAdmin) {
      throw createError(
        403,
        `Forbidden. You must be an administrator to access this resource`
      );
    }
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin };
