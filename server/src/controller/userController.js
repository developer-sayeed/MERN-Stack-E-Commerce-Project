const express = require("express");
const User = require("../model/userModel.js");
const createError = require("http-errors");
const { successResponse } = require("../Helper/responseHandller.js");
const { findWithID } = require("../service/findItemWithID.js");
const { deltePhoto } = require("../Helper/deletePhoto.js");
const { CreateJSONWebtoken } = require("../Helper/jsonWebtoken.js");
const { clientUrl } = require("../screct.js");
const { emailWithNodemail } = require("../Helper/email.js");
const jwt = require(`jsonwebtoken`);

/**
 * @DESC Get All User
 * @ROUTE /api/v1/user
 * @method GET
 * @access private
 */

const getAllUser = async (req, res, next) => {
  try {
    const serach = req.query.serach || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const serachRegExp = new RegExp(".*" + serach + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: serachRegExp } },
        { email: { $regex: serachRegExp } },
        { phone: { $regex: serachRegExp } },
      ],
    };
    //  Password Hidden
    const option = { password: 0 };
    const users = await User.find(filter, option)
      .limit(limit)
      .skip((page - 1) * limit);
    // Check Number of user
    const count = await User.find(filter).countDocuments();

    // Valadation User
    if (!users) throw createError(404, "No users found");

    return successResponse(res, {
      statusCode: 200,
      message: "User Get Success",
      payload: {
        users,
        pagination: {
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @DESC Get Single User
 * @ROUTE /api/v1/user/:id
 * @method GET
 * @access private
 */

const getSingleUser = async (req, res, next) => {
  try {
    // variables

    const id = req.params.id;
    const option = { password: 0 };

    // Find User From Service>FindUser File

    const user = await findWithID(User, id, option);

    // Return data
    return successResponse(res, {
      statusCode: 200,
      message: "Single User Find Success",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @DESC Delete User
 * @ROUTE /api/v1/user/:id
 * @method Delete
 * @access private
 */

const deleteSingleUser = async (req, res, next) => {
  try {
    // variables

    const id = req.params.id;
    const option = { password: 0 };

    // Find User From Service>FindUser File

    const user = await findWithID(User, id, option);

    // user photo Remove
    const userImagePath = user.photo;

    deltePhoto(userImagePath);

    // remove user
    await User.findByIdAndDelete({ _id: id, isAdmin: false });
    // Return data
    return successResponse(res, {
      statusCode: 200,
      message: " User was Delete Success",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @DESC CreateNew  User
 * @ROUTE /api/v1/user/register
 * @method POST
 * @access private
 */

const CreateNewUser = async (req, res, next) => {
  try {
    // variables
    const { name, email, password, phone, address } = req.body;

    // Existing user
    const userExist = await User.exists({ email: email });

    if (userExist) {
      throw createError(409, "Email already exists. pLease Login");
    }

    // Create JWT token

    const token = CreateJSONWebtoken(
      { name, email, password, phone, address },
      process.env.JWT_ACTIVATION_KEY,
      3600
    );

    // prepare Email

    // const emailData = {
    //   email,
    //   subject: "Account Activaton Email",
    //   html: `
    //   <h2>Hello ${name}</h2>
    //   <p>Please Click Here to <a href="${clientUrl}/api/v1/user/activate/${token}" target="_blank">Active Your Account</a></p>`,
    // };

    // Send email with Nodemailer
    // try {
    //   await emailWithNodemail(emailData);
    // } catch (error) {
    //   next(createError(500, `failed to send email`));
    //   return;
    // }

    const newUser = {
      name,
      email,
      password,
      phone,
      address,
    };
    // Return data
    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your Email for Completing your registration process`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @DESC Activation New User By Eamil
 * @ROUTE /api/v1/user/verify
 * @method POST
 * @access private
 */

const activateUserAccount = async (req, res, next) => {
  try {
    // Token

    const token = req.body.token;
    if (!token) {
      throw createError(404, `Token Not Found`);
    }
    try {
      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_ACTIVATION_KEY);
      if (!decoded) {
        throw createError(404, `User was not able to Verify`);
      }
      // Existing user
      const userExist = await User.exists({ email: decoded.email });

      if (userExist) {
        throw createError(409, "Email already exists pLease Login");
      }
      // Create User
      await User.create(decoded);

      // Response
      return successResponse(res, {
        statusCode: 201,
        message: `User Registered successfully`,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, `Token HAs expired`);
      } else if (error.name === "jsonwebtokenError") {
        throw createError(401, `Invalid Token`);
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @DESC Delete User
 * @ROUTE /api/v1/user/:id
 * @method Delete
 * @access private
 */

const editSingleUser = async (req, res, next) => {
  try {
    // Return data
    return successResponse(res, {
      statusCode: 200,
      message: " User was Delete Success",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUser,
  getSingleUser,
  deleteSingleUser,
  CreateNewUser,
  activateUserAccount,
  editSingleUser,
};