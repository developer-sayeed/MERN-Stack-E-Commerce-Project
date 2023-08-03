const express = require("express");
const { getSeedUserController } = require("../controller/seedController");
const seedRouter = express.Router();

seedRouter.get("/user", getSeedUserController);

module.exports = { seedRouter };
