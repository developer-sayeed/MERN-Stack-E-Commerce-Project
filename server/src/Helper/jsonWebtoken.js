const jwt = require("jsonwebtoken");

const CreateJSONWebtoken = (payload, secrectKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be a non-empty object");
  }
  if (typeof secrectKey !== "string" || secrectKey === "") {
    throw new Error("secrectKey must be a non-empty object");
  }
  try {
    const token = jwt.sign(payload, secrectKey, {
      expiresIn,
    });
    return token;
  } catch (error) {
    console.error("Failed to sign JWT:", error);
    throw error;
  }
};

module.exports = { CreateJSONWebtoken };
