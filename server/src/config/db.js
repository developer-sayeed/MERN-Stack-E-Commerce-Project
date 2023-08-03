const mongoose = require("mongoose");
const connecteDatabage = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(`mongodb connect successful`.bgMagenta.black);
  } catch (error) {
    console.log(`${error.message}`.bgRed.black);
  }
};

module.exports = connecteDatabage;
