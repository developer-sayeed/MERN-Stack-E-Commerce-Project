const app = require("./src/app");
const connecteDatabage = require("./src/config/db");
const { serverPort } = require("./src/screct");
require("dotenv").config();
// Sever listeners
app.listen(serverPort, async () => {
  console.log(`server listening on ${serverPort}`.bgCyan.black);
  await connecteDatabage();
});
