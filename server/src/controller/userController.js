const User = require("../model/userModel.js");
const createError = require("http-errors");
const { successResponse } = require("../Helper/responseHandller.js");
const { findWithID } = require("../service/findItemWithID.js");
const { CreateJSONWebtoken } = require("../Helper/jsonWebtoken.js");
const { clientUrl } = require("../screct.js");
const { emailWithNodemail } = require("../Helper/email.js");
const jwt = require(`jsonwebtoken`);
const bcrypt = require("bcryptjs");
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
    if (!users || users.length == 0) throw createError(404, "No users found");

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

    const image = req.file;
    if (!image) {
      throw createError(409, "Image File is required");
    }
    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "Image File to Large, its mus be 2MB required");
    }

    const imageBufferString = req.file.buffer.toString("base64");

    // Existing user
    const userExist = await User.exists({ email: email });

    if (userExist) {
      throw createError(409, "Email already exists. pLease Login");
    }

    // Create JWT token

    const token = CreateJSONWebtoken(
      { name, email, password, phone, address, photo: imageBufferString },
      process.env.JWT_ACTIVATION_KEY,
      3600
    );
    // prepare Email
    const emailData = {
      email,
      subject: "Account Activaton Email",
      html: `
      <h2> Hello ${name} </h2>
      <p>Please Click Here to <a href="${clientUrl}/api/v1/user/activate/${token}" target="_blank">Active Your Account</a></p>`,
    };

    // Send email with Nodemailer

    try {
      await emailWithNodemail(emailData);
    } catch (error) {
      next(createError(500, `failed to send email`));
      return;
    }

    const newUser = {
      name,
      email,
      password,
      phone,
      address,
      photo: imageBufferString,
    };
    console.log(newUser);
    // Return data
    return successResponse(res, {
      statusCode: 200,
      message: `Hi ${name}, Please go to your ${email} for Completing your registration process`,
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
    const userId = req.params.id;
    const updateOptions = { new: true, runValidation: true, context: "query" };
    // Find User From Service>FindUser File
    const option = { password: 0 };
    const user = await findWithID(User, userId, option);
    let update = {};
    const allowedFiled = ["name", "password", "phone", "address"];
    for (let key in req.body) {
      if (allowedFiled.includes(key)) {
        update[key] = req.body[key];
      } else if (key == email) {
        throw createError(400, "Email Can Not be Updated");
      }
    }

    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "Image File to Large, its mus be 2MB required");
      }
      update.photo = image.buffer.toString("base64");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User with This Id dose not exist");
    }
    // Return data
    return successResponse(res, {
      statusCode: 200,
      message: " User was Updated Success",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @DESC Banned User
 * @ROUTE /api/v1/user/ban-user:id
 * @method PUT
 * @access private Admin Only
 */

const handleBanUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithID(User, userId);
    const update = { isBanned: true };
    const updateOptions = { new: true, runValidation: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User was not banned Successfully");
    }
    // Return data
    return successResponse(res, {
      statusCode: 200,
      message: " User was Banned Success",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @DESC UnBanned User
 * @ROUTE /api/v1/user/unban-user:id
 * @method PUT
 * @access private Admin Only
 */

const handleUnBanUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithID(User, userId);
    const update = { isBanned: false };
    const updateOptions = { new: true, runValidation: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User was not Unbanned Successfully");
    }
    // Return data
    return successResponse(res, {
      statusCode: 200,
      message: " User was UnBanned Success",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @DESC Update Password
 * @ROUTE /api/v1/user/update-password
 * @method PUT
 * @access private Only Loggin User Access Only
 */

const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id;
    const user = await findWithID(User, userId);

    //Compare the password

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw createError(400, "oldPassword Did not Correctly Exists");
    }

    const filter = { userId };
    const update = { $Set: { password: newPassword } };
    const updateOptions = { new: true };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User Password was not Updated Successfully");
    }
    next();
    // Return data
    return successResponse(res, {
      statusCode: 200,
      message: " User Password Updated Success",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @DESC Forget Password
 * @ROUTE /api/v1/user/forget-password
 * @method PUT
 * @access private
 */

const updateForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const userData = await User.findOne({ email: email });

    if (!userData) {
      throw createError(
        404,
        `Email is incorrect or you have not verified your email. please register first Yourself`
      );
    }

    // Create JWT token

    const token = CreateJSONWebtoken(
      { email },
      process.env.JWT_RESET_PASSWORD_KEY,
      3600
    );
    // prepare Email
    const emailData = {
      email,
      subject: "Reset Password Email",
      html: `
          <h2> Hello ${userData.name} </h2>
          <p>Please Click Here to <a href="${clientUrl}/api/v1/user/reset-password/${token}" target="_blank">Reset Your Password</a></p>`,
    };

    // Send email with Nodemailer

    try {
      await emailWithNodemail(emailData);
    } catch (error) {
      next(createError(500, `failed to send reset password email`));
      return;
    }
    // Return data
    return successResponse(res, {
      statusCode: 200,
      message: `Please got to your ${email} for reseting the password`,
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @DESC Reset Password
 * @ROUTE /api/v1/user/reset-password
 * @method PUT
 * @access private
 */

const updateResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_RESET_PASSWORD_KEY);

    if (!decoded) {
      throw createError(400, `Invalid or Expired Token`);
    }
    const filter = { email: decoded.email };
    const update = { password: password };
    const option = { new: true };
    const updatedUser = await User.findOneAndUpdate(
      filter,
      update,
      option
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "Password reset failed");
    }

    // Return data
    return successResponse(res, {
      statusCode: 200,
      message: `Password Reset Successfully`,
      payload: {},
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
  handleBanUser,
  handleUnBanUser,
  updatePassword,
  updateForgetPassword,
  updateResetPassword,
};
