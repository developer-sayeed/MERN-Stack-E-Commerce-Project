const express = require("express");
const User = require("../model/userModel.js");
const data = require("../db/data.js");

const getSeedUserController = async (req, res, next) => {
  try {
    // deleting existing users
    await User.deleteMany({});

    //  Inserting new users
    const user = await User.insertMany(data.users);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSeedUserController };
