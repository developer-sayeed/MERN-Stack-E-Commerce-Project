// Config Dot ENV
require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 5000;

//mongodb configuration
const MongodbURL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/E-CommerceMern ";

// User Image configuration

const defaulthImagePath =
  process.env.DEFAULTH_USER_IMAGE || "public/images/users/default.png";
// JWT configuration
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY;

// SMPT configuration
const smptUsername = process.env.SMTP_USERNAME || "";
const smptPassword = process.env.SMTP_PASSWORD || "";
const clientUrl = process.env.CLIENT_URL || "";

// export
module.exports = {
  MongodbURL,
  serverPort,
  defaulthImagePath,
  jwtActivationKey,
  smptUsername,
  smptPassword,
  clientUrl,
};
